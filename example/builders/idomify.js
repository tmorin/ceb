import {Builder, method, template} from 'es6/lib/ceb.js';
import {compile, patch} from 'es6/lib/incremental-dom-factory.js';
import {assign} from 'es6/lib/utils.js';

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

        //let idomifyOptions = assign({},OPTIONS, this.data.options);
        on('after:createdCallback').invoke(el => {
            console.log(el.tagName, 'created');
            //el.idomRender = compile(this.data.tpl, this.data.options);
            el.idomRender = render;
            el.render();
        });

        method('render').invoke(el => {
            // needed for chrome
            setTimeout(() => {
                console.log(el.tagName, 'patched');
                patch(el, el.idomRender, el);
            }, 0);
        }).build(proto, on);
    }

}

export function idomify(tpl) {
    return new IdomBuilder(tpl);
}

