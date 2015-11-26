import {element, attribute, method} from '../../src/ceb.js';
import {jquerify} from '../builders/jquerify.js';

export default element().base(Object.create(HTMLButtonElement.prototype), 'button').builders(
    jquerify(),

    attribute('meaning')
        .value('default')
        .listen((el, oldValue, newValue) => el.$el.removeClass('btn-' + oldValue).addClass('btn-' + newValue)),

    method('createdCallback').invoke(el => {
        el.$el.addClass('btn');
    })
).register('ceb-button');
