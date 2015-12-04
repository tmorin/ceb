import {element, attribute, method} from 'ceb';
import handlebars from 'handlebars/dist/handlebars.js';

const COMPILERS = {
    'text/x-handlebars-template'(tpl) {
        return handlebars.compile(tpl);
    }
};


let cebTemplatorBuilder = element().base(Object.create(HTMLScriptElement.prototype), 'script');

cebTemplatorBuilder.builders(
    attribute('type')
);

cebTemplatorBuilder.builders(
    method('render').invoke((el, data) => {
        let render = COMPILERS[el.type];
        if (render) {
            return render(el.textContent)(data);
        }
    })
);

export default cebTemplatorBuilder.register('ceb-templator');
