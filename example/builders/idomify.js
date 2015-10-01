import {Builder, method, template} from 'es6/lib/ceb.js';
import {assign} from 'es6/lib/utils.js';
import {compile} from 'idomizer';
import IncrementalDOM from 'incremental-dom';

export class IdomBuilder extends Builder {

    constructor(tpl = '') {
        super();
        this.data = {tpl, options: {}, helpers: {}};
    }

    options(options) {
        this.data.options = options;
        return this;
    }

    helpers(options) {
        this.data.options = options;
        return this;
    }

    build(proto, on) {
        let factory = typeof this.data.tpl === 'function' ? this.data.tpl : compile(this.data.tpl, this.data.options);
        let render = factory(IncrementalDOM, this.data.helpers);

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
            IncrementalDOM.patch(el, render, el);
        }).build(proto, on);
    }

}

export function idomify(tpl) {
    return new IdomBuilder(tpl);
}
