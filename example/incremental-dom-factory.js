import idom from 'idom';
import htmlparser2 from 'htmlparser2';
import {assign} from 'es6/lib/utils.js';

const OPTIONS = {
    ATT_EXP_START: '{{',
    ATT_EXP_STOP: '}}',
    TAG_EXP: '%',
    MODIFIER_VALUE: '=',
    MODIFIER_ESCAPED_VALUE: '-'
};

export function factory(html, options) {
    options = assign({}, OPTIONS, options);

    let fnBody = '';

    let parser = new htmlparser2.Parser({
        onopentag(name, attrs) {
            if (name === options.TAG_EXP) {
                fnBody += Object.keys(attrs).join('') + ';';
            } else if (name === options.TAG_EXP + options.MODIFIER_VALUE ) {
                fnBody += `t(${Object.keys(attrs).join('')});`;
            } else if (name === options.TAG_EXP + options.MODIFIER_ESCAPED_VALUE ) {
                // TODO: escape value
                fnBody += `t(${Object.keys(attrs).join('')});`;
            } else {
                let statics = [];
                let varArgs = [];
                Object.keys(attrs).forEach(key => {
                    let value = attrs[key];
                    let expValues = [];
                    let startExpIndex = value.indexOf(options.ATT_EXP_START, 0);
                    if (startExpIndex > -1) {
                        if (startExpIndex > 0) {
                            expValues.push(`'${value.substring(0, startExpIndex)}'`);
                        }
                        while (true) {
                            startExpIndex = startExpIndex + options.ATT_EXP_START.length;
                            let stopExpIndex = value.indexOf(options.ATT_EXP_STOP, startExpIndex);
                            if (stopExpIndex > startExpIndex) {
                                let exp = value.substring(startExpIndex, stopExpIndex);
                                expValues.push(`(${exp})`);

                                stopExpIndex = stopExpIndex + options.ATT_EXP_START.length;
                                startExpIndex = value.indexOf(options.ATT_EXP_START, stopExpIndex);

                                if (startExpIndex > stopExpIndex) {
                                    let exp = value.substring(stopExpIndex, startExpIndex);
                                    expValues.push(`'${exp}'`);
                                } else if (stopExpIndex < value.length) {
                                    let exp = value.substring(stopExpIndex, value.length);
                                    expValues.push(`'${exp}'`);
                                    break;
                                } else {
                                    break;
                                }
                            } else {
                                throw new Error('no stop expression found!');
                            }
                        }
                        varArgs.push(`'${key}', ${expValues.join(' + ')}`);
                    } else {
                        statics.push(`'${key}', '${value}'`);
                    }
                });
                fnBody += `o('${name}', null, ${statics.length > 0 ? `[${statics.join(', ')}]` : 'null'}, ${varArgs.length > 0 ? varArgs.join(', ') : 'null'});`;
            }
        },
        ontext(text) {
            fnBody += `t('${text.replace('\n', '\\n')}');`;
        },
        onclosetag(name) {
            if (name.indexOf('%') < 0) {
                fnBody += `c('${name}');`;
            }
        }
    }, {
        decodeEntities: true,
        lowerCaseAttributeNames: false
    });

    parser.parseComplete(html);

    let fnWrapper = `var o = i.elementOpen, c = i.elementClose, v = i.elementVoid, t = i.text;return function (data) {${fnBody}};`;

    return new Function(['i'], fnWrapper);
}

export function compile(tpl, options) {
    return factory(tpl, options)(idom);
}

export function patch(domNode, render, data) {
    return idom.patch(domNode, render, data);
}
