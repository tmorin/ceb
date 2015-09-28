import IDOM from 'incremental-dom';
import htmlparser2 from 'htmlparser2';
import {assign} from './../utils.js';

export const IncrementalDOM = IDOM;

export const OPTIONS = {
    pretty: true,
    evaluation: /\{\{([\s\S]+?)}}/gm,
    attributeKey: 'tpl-key',
    attributePlaceholder: 'tpl-placeholder',
    varName: 'data',
    elements: {
        'tpl-logger': {
            onopentag(name, attrs, key, statics, varArgs) {
                let level = statics.level || varArgs.level || 'log',
                    content = statics.content || varArgs.content || '';
                return `console.${level}(${content});`;
            }
        },
        'tpl-each': {
            onopentag(name, attrs, key, statics, varArgs) {
                let itemsName = statics.items || varArgs.items || `'items'`,
                    itemName = statics.item || varArgs.item || `'item'`,
                    indexName = statics.index || varArgs.index || `index`;
                return `(${itemsName} || []).forEach(function (${itemName}, ${indexName}) {`;
            },
            onclosetag(name, attrs, statics, varArgs) {
                return `});`;
            }
        },
        'tpl-text': {
            onopentag(name, attrs, key, statics, varArgs) {
                return `t(${statics.value || varArgs.value});`;
            }
        }
    },
    // http://www.w3.org/TR/html5/syntax.html#void-elements
    selfClosingElements: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
};

function stringify(value = '') {
    return value.replace(/'/gim, '\\\'').replace(/\n/gi, '\\n');
}

function isSelfClosing(name = '', options = OPTIONS) {
    return options.selfClosingElements.indexOf(name) > -1;
}

function getFunctionName(name = '', placeholder = false, options = OPTIONS) {
    return placeholder ? 'ph' : (isSelfClosing(name, options) ? 'v' : 'o');
}

function append(body = '', line = '', options = OPTIONS) {
    return body + (options.pretty ? '\n' : '') + line;
}

/**
 * Evaluate the string to return a JavaScript compliant syntax.
 * @param {!string} value the value
 * @param {*} options the options
 * @returns {string} the JavaScript compliant syntax
 */
export function evaluate(value = '', options = OPTIONS) {
    let js = [];
    let result;
    let lastIndex = 0;
    while ((result = options.evaluation.exec(value)) !== null) {
        let full = result[0];
        let group = result[1];
        let index = result.index;
        let before = value.substring(lastIndex, index);
        if (before) {
            js.push(`'${stringify(before)}'`);
        }
        js.push(`(${group})`);
        lastIndex = index + full.length;
    }
    let after = value.substring(lastIndex, value.length);
    if (after) {
        js.push(`'${stringify(after)}'`);
    }
    return js.join(' + ');
}

function parseAttributes(attrs = {}, options = OPTIONS) {
    let statics = {},
        varArgs = {},
        key,
        placeholder = attrs[options.attributePlaceholder] !== null && attrs[options.attributePlaceholder] !== undefined;
    Object.keys(attrs)
        .filter(key => [options.attributePlaceholder].indexOf(key) < 0)
        .forEach(function (key) {
            let value = attrs[key];
            if (value.search(options.evaluation) > -1) {
                varArgs[key] = evaluate(value, options);
            } else {
                statics[key] = value;
            }
        });
    key = statics[options.attributeKey] || varArgs[options.attributeKey];
    delete statics[options.attributeKey];
    delete varArgs[options.attributeKey];
    return [statics, varArgs, key, placeholder];
}

/**
 * Helper to transform a map of variables attributes into a JavaScript compliant syntax.
 * @param {*} varArgs the variables arguments
 * @returns {string} the JavaScript
 */
export function varArgsToJs(varArgs = {}) {
    let keys = Object.keys(varArgs);
    return keys.length > 0 ? (keys.map(key => `'${key}', ${varArgs[key]}`).join(', ')) : 'null';
}

/**
 * Helper to transform a map of statics attributes into a JavaScript compliant syntax.
 * @param {*} statics the statics
 * @returns {string} the JavaScript
 */
export function staticsToJs(statics = {}) {
    let keys = Object.keys(statics);
    return keys.length > 0 ? `[${keys.map(key => `'${key}', '${stringify(statics[key])}'`).join(', ')}]` : 'null';
}

/**
 * Compile the given HTML template into a function factory.
 *
 * If the incrementalDOM argument is provided, this function will return a render function.
 * The render function is used with IncrementalDOM.patch.
 *
 * If the incrementalDOM argument is not provided, this function will return a factory function.
 * The factory function requires the IncrementalDOM library as argument and return the render function..
 *
 * Basically, when the template is compiled at build time, the IncrementalDOM should not be given.
 * When the template is compiled at runtime, the IncrementalDOM should be given.
 *
 * @param {!string} html the template
 * @param {Object} [options] the options
 * @param {IncrementalDOM} [incrementalDOM] the IncrementalDOM library
 * @returns {function(i: !IncrementalDOM)} the function factory
 */
export function compile(html = '', options = {}, incrementalDOM = null) {
    options = assign({}, OPTIONS, options);

    let fnBody = '';
    let skipClosing;
    let parser = new htmlparser2.Parser({
        onopentag(name, attrs) {
            let [statics, varArgs, key, placeholder] = parseAttributes(attrs, options);
            skipClosing = placeholder;
            if (options.elements[name]) {
                let element = options.elements[name];
                if (typeof element.onopentag === 'function') {
                    fnBody = append(fnBody, element.onopentag(name, attrs, key, statics, varArgs), options);
                }
            } else {
                let fn = getFunctionName(name, placeholder, options);
                fnBody = append(fnBody, `${fn}('${name}', ${key ? `${key}` : 'null'}, ${staticsToJs(statics)}, ${varArgsToJs(varArgs)});`, options);
            }
        },
        onclosetag(name) {
            if (options.elements[name]) {
                let element = options.elements[name];
                if (typeof element.onclosetag === 'function') {
                    fnBody = append(fnBody, element.onclosetag(name), options);
                }
            } else if (!isSelfClosing(name, options) && !skipClosing) {
                fnBody = append(fnBody, `c('${name}');`, options);
            }
            skipClosing = false;
        },
        ontext(text){
            if (text.search(options.evaluation) > -1) {
                console.log('evaluate %s - %s', text, evaluate(text, options));
                fnBody = append(fnBody, `${evaluate(text, options)};`, options);
            } else {
                fnBody = append(fnBody, `t('${stringify(text)}');`, options);
            }
        }
    }, {
        xmlMode: false,
        decodeEntities: true,
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
        recognizeSelfClosing: true
    });

    parser.parseComplete(html);

    let fnWrapper = `
        var o = i.elementOpen, c = i.elementClose, v = i.elementVoid, t = i.text, ph = i.elementPlaceholder;
        return function (_data_) {
            var ${options.varName} = _data_ || {};
            ${fnBody}
        };
    `;
    let factory = new Function(['i'], fnWrapper);
    if (incrementalDOM) {
        return factory(incrementalDOM);
    }

    return factory;
}

/**
 * Patch the document from the given DOM node.
 * @param {!Element|!DocumentFragment} domNode the DOM node
 * @param {!function(data: *)} render the render function
 * @param {!*} data the data representing the DOM state
 */
export function patch(domNode, render, data) {
    IDOM.patch(domNode, render, data);
}
