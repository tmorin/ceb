import {Builder, method} from 'es6/lib/ceb.js';
import itemplate from 'itemplate';
import idom from 'idom';

export class IdomBuilder extends Builder {

    constructor(tpl) {
        super();
        this.data = {tpl};
    }

    build(proto, on) {
        let render = itemplate.compile(this.data.tpl, idom);

        on('after:createdCallback').invoke(el => {
            el.render();
        });

        method('render').invoke(el => {
            idom.patch(el, render, el);
        }).build(proto, on);
    }

}

export function idomify(tpl) {
    return new IdomBuilder(tpl);
}
