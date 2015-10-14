import $ from 'jquery';

import {ceb, attribute, method} from 'es6/lib/ceb.js';

export default ceb().proto(Object.create(HTMLSelectElement.prototype)).extends('select').augment(
    attribute('type').value('text'),

    method('createdCallback').invoke(el => {
        $(el).addClass('form-control');
    })
).register('wui-select');
