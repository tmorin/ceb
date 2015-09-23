import IncrementalDOM from 'incremental-dom';
import htmlparser2 from 'htmlparser2';
import {assign} from './utils.js';

export const OPTIONS = {
    pretty: true,
    eachElement: 'tpl-each',
    textElement: 'tpl-text',
    evaluation: /\{\{([\s\S]+?)\}\}/gm,
    attributeKey: 'tpl-key',
    placeholderElement: 'tpl-placeholder',
    varName: 'data',
    customElements: {
        'tpl-logger': {
            onopentag: function (name, attrs, statics, varArgs) {
                return `console.${statics.level || statics.level || 'log'}(${statics.content || varArgs.content});`;
            }
        }
    },
    // http://www.w3.org/TR/html5/syntax.html#void-elements
    selfClosingElements: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
};

function escapeSingleQuote(value = '') {
    return value.replace(/'/gim, '\\\'');
}

function isSelfClosing(name = '', options = OPTIONS) {
    return options.selfClosingElements.indexOf(name) > -1;
}

function getFunctionName(name = '', options = OPTIONS) {
    return isSelfClosing(name, options) ? 'v' : 'o';
}

function append(body = '', line = '', options = OPTIONS) {
    return body + (options.pretty ? '\n' : '') + line;
}

function evaluate(value = '', options = OPTIONS) {
    let js = [];
    let result;
    let lastIndex = 0;
    while ((result = options.evaluation.exec(value)) !== null) {
        let full = result[0];
        let group = result[1];
        let index = result.index;
        let before = value.substring(lastIndex, index);
        if (before) {
            js.push(`'${escapeSingleQuote(before)}'`);
        }
        js.push(`(${group})`);
        lastIndex = index + full.length;
    }
    let after = value.substring(lastIndex, value.length);
    if (after) {
        js.push(`'${escapeSingleQuote(after)}'`);
    }
    return js.join(' + ');
}

function parseAttributes(attrs = {}, options = OPTIONS) {
    let statics = {};
    let varArgs = {};

    Object.keys(attrs).forEach(function (key) {
        let value = attrs[key];
        if (value.search(options.evaluation) > -1) {
            varArgs[key] = evaluate(value, options);
        } else {
            statics[key] = value;
        }
    });

    return [statics, varArgs];
}

function varArgsToJs(varArgs = {}) {
    let keys = Object.keys(varArgs);
    return keys.length > 0 ? (keys.map(key => `'${key}', ${varArgs[key]}`).join(', ')) : 'null';
}

function staticsToJs(statics = {}) {
    let keys = Object.keys(statics);
    return keys.length > 0 ? `[${keys.map(key => `'${key}', '${escapeSingleQuote(statics[key])}'`).join(', ')}]` : 'null';
}

export function compile(html = '', options = {}) {
    options = assign({}, OPTIONS, options);

    let fnBody = '';

    let parser = new htmlparser2.Parser({
        onopentag(name, attrs) {
            let statics, varArgs, fn, key = attrs[options.attributeKey];
            switch (name) {
                case OPTIONS.eachElement:
                    fnBody = append(fnBody, `(${attrs.items} || []).forEach(function (${attrs.item}, ${attrs.index}) {`, options);
                    break;
                case OPTIONS.textElement:
                    let value = attrs.value;
                    if (value.search(options.evaluation) > -1) {
                        value = evaluate(value, options);
                    }
                    fnBody = append(fnBody, `t(${value});`, options);
                    break;
                case OPTIONS.placeholderElement:
                    key = key || Date.now();
                    [statics, varArgs] = parseAttributes(attrs, options);
                    append(fnBody, `ph('${name}', ${key ? `'${key}'` : 'null'}, ${staticsToJs(statics)}, ${varArgsToJs(varArgs)});`, options);
                    break;
                default:
                    [statics, varArgs] = parseAttributes(attrs, options);
                    if (options.customElements[name]) {
                        if (typeof options.customElements[name].onopentag === 'function') {
                            fnBody = append(fnBody, options.customElements[name].onopentag(name, attrs, statics, varArgs), options);
                        }
                    } else {
                        fn = getFunctionName(name, options);
                        fnBody = append(fnBody, `${fn}('${name}', ${key ? `'${key}'` : 'null'}, ${staticsToJs(statics)}, ${varArgsToJs(varArgs)});`, options);
                    }
            }
        },
        onclosetag(name) {
            if (isSelfClosing(name)) {
                return;
            }
            switch (name) {
                case OPTIONS.eachElement:
                    fnBody = append(fnBody, `});`, options);
                    break;
                case OPTIONS.textElement:
                case OPTIONS.placeholderElement:
                    break;
                default:
                    if (options.customElements[name]) {
                        if (typeof options.customElements[name].onclosetag === 'function') {
                            fnBody = append(fnBody, options.customElements[name].onclosetag(name), options);
                        }
                    } else {
                        fnBody = append(fnBody, `c('${name}');`, options);
                    }
            }
        },
        ontext(text){
            fnBody = append(fnBody, `t('${escapeSingleQuote(text)}');`, options);
        }
    }, {
        xmlMode: false,
        decodeEntities: true,
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
        recognizeSelfClosing: true
    });

    parser.parseComplete(html.replace(/\n/gi, '\\n'));

    let fnWrapper = `var o = i.elementOpen, c = i.elementClose, v = i.elementVoid, t = i.text, ph = i.elementPlaceholder;return function (${options.varName}) {${fnBody}};`;

    let fn = new Function(['i'], fnWrapper);

    return fn(IncrementalDOM);
}

export function patch(domNode, render, data) {
    return IncrementalDOM.patch(domNode, render, data);
}
