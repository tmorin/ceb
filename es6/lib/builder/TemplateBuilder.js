import isFunction from 'lodash/lang/isFunction.js';
import isString from 'lodash/lang/isString.js';

import Builder from './Builder.js';

/**
 * The template builder.
 * Its goal is to provide a way to fill the content of a custom element.
 * @extends {Builder}
 */
export class TemplateBuilder extends Builder {

    /**
     * @param {!string|function} tpl the template
     */
    constructor(tpl) {
        super();
        /**
         * @ignore
         */
        this.data = {tpl};
    }

    /**
     * @ignore
     */
    build(proto, on) {
        var data = this.data;
        var html = isString(data.tpl) ? data.tpl : null;
        on('before:createdCallback').invoke(el => {
            if (isFunction(data.tpl)) {
                html = data.tpl(el);
            }
            el.innerHTML = html;
        });
    }

}

/**
 * @ignore
 */
export default function helper(tpl) {
    return new TemplateBuilder(tpl);
}

