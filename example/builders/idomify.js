import {Builder, method, template} from 'es6/lib/ceb.js';
import {assign} from 'es6/lib/utils.js';
import {compile, patch} from 'es6/lib/idom/idom.js';
import IncrementalDOM from 'incremental-dom';

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
        let render;
        if (typeof this.data.tpl === 'function') {
            render = this.data.tpl;
        } else {
            render = compile(this.data.tpl, this.data.options, IncrementalDOM);
        }

        on('ready:createdCallback').invoke(el => {
            console.log('%s %s %s %s', el.tagName, 'before:createdCallback', el.getAttribute('id'), el.attributes.length);
            el.render();
        });

        on('ready:attachedCallback').invoke(el => {
            console.log('%s %s %s', el.tagName, 'ready:attachedCallback', el.getAttribute('id'));
            setTimeout(() => {
                el.render();
            }, 0);
        });

        on('ready:detachedCallback').invoke(el => {
            console.log('%s %s %s', el.tagName, 'ready:detachedCallback', el.getAttribute('id'));
        });

        method('render').invoke(el => {
            console.log('%s %s %s', el.tagName, 'render', el.getAttribute('id'));
            patch(el, render, el);
        }).build(proto, on);
    }

}

export function idomify(tpl) {
    return new IdomBuilder(tpl);
}
