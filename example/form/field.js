import {ceb, method, on, template} from '../../es6/lib/ceb.js';
import {jquerify} from '../builders/jquerify.js';

export default ceb().builders(
    jquerify(),

    template('<content></content>'),

    method('createdCallback').invoke(el => {
        el.$.addClass('form-group').css('display', 'block');
    }),

    on('form-control-valid').invoke(el => {
        el.$.removeClass('has-error');
    }),

    on('form-control-invalid').invoke(el => {
        el.$.addClass('has-error');
    })
).register('ceb-field');
