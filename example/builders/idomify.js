import {Builder, method} from 'es6/lib/ceb.js';
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

    helpers(helpers) {
        assign(this.data.helpers, helpers);
        return this;
    }

    build(proto, on) {
        let factory = typeof this.data.tpl === 'function' ? this.data.tpl : compile(this.data.tpl, this.data.options);
        let render = factory(IncrementalDOM, this.data.helpers);

        method('render').invoke(el => {
            IncrementalDOM.patch(el, render, el);
        }).build(proto, on);
    }

}

export function idomify(tpl) {
    return new IdomBuilder(tpl);
}
