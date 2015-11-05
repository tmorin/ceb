import $ from 'jquery';
import {ceb, attribute, method} from '../../es6/lib/ceb.js';

export default ceb().proto(Object.create(HTMLInputElement.prototype)).extend('input').builders(
    attribute('type').listen((el, oldVal, newVal) => {
        if (newVal === 'checkbox' || newVal === 'radio') {
            $(el).removeClass('form-control');
        } else {
            $(el).addClass('form-control');
        }
    }),
    method('createdCallback').invoke(el => {
        $(el).addClass('form-control');
    })
).register('wui-input');
