import $ from 'jquery';

import {ceb, attribute} from 'es6/lib/ceb.js';

export default ceb().augment(
    attribute('glyphicon').listen((el, oldValue, newValue) => {
        let $el = $(el);
        $el.removeClass('glyphicon glyphicon-' + oldValue);
        if (newValue) {
            $el.addClass('glyphicon glyphicon-' + newValue);
        }
    }),

    attribute('fa').listen((el, oldValue, newValue) => {
        let $el = $(el);
        $el.removeClass('fa fa-' + oldValue);
        if (newValue) {
            $el.addClass('fa fa-' + newValue);
        }
    })
).register('wui-icon');
