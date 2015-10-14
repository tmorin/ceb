import $ from 'jquery';
import {ceb, method, attribute, template} from 'es6/lib/ceb.js';

export default ceb().augment(
    template('<label ceb-content></label>'),
    attribute('inline').boolean().listen((el, oldValue, newValue) => {
        if (newValue) {
            $(el).removeClass('radio').addClass('radio-inline');
        } else {
            $(el).addClass('radio').removeClass('radio-inline');
        }
    })
).register('wui-field-radio');
