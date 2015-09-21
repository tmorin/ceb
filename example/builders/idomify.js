import {Builder, method} from 'es6/lib/ceb.js';
import {compile, patch} from '../incremental-dom-factory.js';

const OPTIONS = {
    ATT_EXP_START: '{{',
    ATT_EXP_STOP: '}}'
};

export class IdomBuilder extends Builder {

    constructor(tpl) {
        super();
        this.data = {tpl};
    }

    build(proto, on) {
        let render = compile(this.data.tpl);

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

