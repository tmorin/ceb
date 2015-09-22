import idom from 'idom';
import htmlparser2 from 'htmlparser2';
import {assign} from 'es6/lib/utils.js';

const HELPERS = {};

export const OPTIONS = {
    INLINE_EXP_START: '{{',
    INLINE_EXP_STOP: '}}',
    ATTRIBUTE_KEY: 'idom-key',
    ATTRIBUTE_PLACEHOLDER: 'content',
    ELEMENT_PLACEHOLDER: 'content',
    ELEMENT_EXP: '%',
    MARKER_VALUE: '=',
    // http://www.w3.org/TR/html5/syntax.html#void-elements
    SELF_CLOSING: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
};

function parse(template, options) {
    let startExpIndex = template.indexOf(options.INLINE_EXP_START, 0);

    if (startExpIndex < 0) {
        return [{
            text: template
        }];
    }

    let parts = [];

    if (startExpIndex > 0) {
        parts.push({
            text: template.substring(0, startExpIndex)
        });
    }

    while (true) {
        startExpIndex = startExpIndex + options.INLINE_EXP_START.length;

        let stopExpIndex = template.indexOf(options.INLINE_EXP_STOP, startExpIndex);

        if (stopExpIndex > startExpIndex) {
            let exp = template.substring(startExpIndex, stopExpIndex);

            if (exp.indexOf(options.MARKER_VALUE) === 0) {
                parts.push({
                    value: exp.substring(options.MARKER_VALUE.length, exp.length)
                });
            } else {
                parts.push({
                    exp: exp
                });
            }

            stopExpIndex = stopExpIndex + options.INLINE_EXP_START.length;
            startExpIndex = template.indexOf(options.INLINE_EXP_START, stopExpIndex);

            if (startExpIndex > stopExpIndex) {
                parts.push({
                    text: template.substring(stopExpIndex, startExpIndex)
                });
            } else if (stopExpIndex < template.length) {
                parts.push({
                    text: template.substring(stopExpIndex, template.length)
                });
                // end of template
                break;
            } else {
                // end of template
                break;
            }
        } else {
            throw new Error('no stop expression found!');
        }
    }

    return parts;
}

function parseAttribute(attrs, options) {
    let statics = [];
    let varArgs = [];
    Object.keys(attrs).forEach(key => {
        parse(attrs[key], options).forEach(part => {
            if (part.text) {
                statics.push(`'${key}', '${part.text}'`);
            } else if (part.value) {
                varArgs.push(`'${key}', (${part.value})`);
            } else if (part.exp) {
                varArgs.push(`'${key}', (${part.exp})`);
            }
        });
    });
    let staticsJs = statics.length > 0 ? `[${statics.join(', ')}]` : 'null';
    let varArgsJs = varArgs.length > 0 ? varArgs.join(', ') : 'null';
    return [staticsJs, varArgsJs];
}

export function compile(html, options) {
    options = assign({}, OPTIONS, options);

    let fnBody = '';

    let parser = new htmlparser2.Parser({
        onopentag(name, attrs) {
            let key = attrs[options.ATTRIBUTE_KEY];
            if (attrs[options.ATTRIBUTE_PLACEHOLDER] || name === options.ELEMENT_PLACEHOLDER) {
                key = key || Date.now();
                let [statics, varArgs] = parseAttribute(attrs, options);
                fnBody += `ph('${name}}', '${key}', ${statics}, ${varArgs});`;
            } else if (name === options.ELEMENT_EXP) {
                fnBody += Object.keys(attrs).join('') + ';';
            } else if (name === options.ELEMENT_EXP + options.MARKER_VALUE) {
                fnBody += `t(${Object.keys(attrs).join('')});`;
            } else {
                let [statics, varArgs] = parseAttribute(attrs, options);
                let fn = options.SELF_CLOSING.indexOf(name) > -1 ? 'v' : 'o';
                fnBody += `${fn}('${name}', ${key ? `'${key}'` : 'null'}, ${statics}, ${varArgs});`;
            }
        },
        onclosetag(name) {
            if (name.indexOf(options.ELEMENT_EXP) < 0 && options.SELF_CLOSING.indexOf(name) < 0) {
                fnBody += `c('${name}');`;
            }
        },
        ontext(text) {
            fnBody += parse(text, options).map(part => {
                if (part.text) {
                    return `t('${part.text}');`;
                } else if (part.value) {
                    return `t(${part.value});`;
                }
                return `${part.exp};`;
            }).join('');
        }
    }, {
        xmlMode: false,
        decodeEntities: true,
        lowerCaseTags: false,
        lowerCaseAttributeNames: false,
        recognizeSelfClosing: true
    });

    parser.parseComplete(html.replace(/\n/gi, '\\n'));

    let fnWrapper = `var o = i.elementOpen, c = i.elementClose, v = i.elementVoid, t = i.text, ph = i.elementPlaceholder;return function (data) {${fnBody}};`;
    console.log(fnWrapper.replace(/;/gi, ';\n'));
    let fn = new Function(['i', 'helpers'], fnWrapper);
    return fn(idom, assign({}, HELPERS, options.helpers));
}

export function patch(domNode, render, data) {
    return idom.patch(domNode, render, data);
}
