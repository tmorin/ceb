import {ceb, attribute, method} from '../../es6/lib/ceb.js';
import {jquerify} from '../builders/jquerify.js';

export default ceb().proto(Object.create(HTMLButtonElement.prototype)).extend('button').builders(
    jquerify(),

    attribute('meaning')
        .value('default')
        .listen((el, oldValue, newValue) => el.$el.removeClass('btn-' + oldValue).addClass('btn-' + newValue)),

    method('createdCallback').invoke(el => {
        el.$el.addClass('btn');
    })
).register('ceb-button');
