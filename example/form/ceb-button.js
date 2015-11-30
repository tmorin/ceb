import {element, method, attribute} from 'ceb';
import $ from 'jquery';

let cebButtonBuilder = element().base(Object.create(HTMLButtonElement.prototype), 'button');

cebButtonBuilder.on('before:createdCallback').invoke(el => {
    el.$el = $(el);
});

cebButtonBuilder.builders(
    method('createdCallback').invoke(el => {
        el.$el.addClass('btn');
    })
);

cebButtonBuilder.builders(
    attribute('alt-style')
        .value('default')
        .listen((el, oldValue, newValue) => {
            el.$el.removeClass('btn-' + oldValue).addClass('btn-' + newValue);
        })
);

export default cebButtonBuilder.register('ceb-button');
