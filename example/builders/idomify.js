import {Builder, method, template} from 'es6/lib/ceb.js';
import {compile, patch} from '../incremental-dom-parser.js';

export class IdomBuilder extends Builder {

    constructor(tpl = '') {
        super();
        this.data = {tpl, options: {}};
    }

    options(options) {
        this.data.options = options;
        return this;
    }

    build(proto, on) {
        let render = compile(this.data.tpl, this.data.options);

        on('after:createdCallback').invoke(el => {
            el.render();
        });

        method('render').invoke(el => {
            patch(el, render, el);
        }).build(proto, on);
    }

}

export function idomify(tpl) {
    return new IdomBuilder(tpl);
}

