import $ from 'jquery';

import {ceb, attribute, method} from '../../es6/lib/ceb.js';

export default ceb().proto(Object.create(HTMLButtonElement.prototype)).extend('button').builders(
    attribute('type').value('button'),

    attribute('meaning')
        .value('default')
        .listen((el, oldValue, newValue) => $(el).removeClass('btn-' + oldValue).addClass('btn-' + newValue)),

    method('createdCallback').invoke(el => {
        $(el).addClass('btn');
    })
).register('wui-button');
