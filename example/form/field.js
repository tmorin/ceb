import {ceb, method, property, on, template} from '../../es6/lib/ceb.js';
import {jquerify} from '../builders/jquerify.js';

export default ceb().builders(
    jquerify(),

    template('<content></content>'),

    property('messages').value({
        required: 'The field is required.',
        maxlength: data => `The value must be lower than ${data.maxlength} characters.`,
        minlength: data => `The value must be higher than ${data.minlength} characters.`
    }),

    method('createdCallback').invoke(el => {
        el.$el.addClass('form-group').css('display', 'block');
    }),

    on('valid').invoke(el => {
        el.$el.removeClass('has-error').find('.help-block.errors').remove();
    }),

    on('invalid').invoke((el, evt) => {
        let errors = evt.detail.errors;
        let messages = Object.keys(errors).map(key => {
            let message = el.messages[key];
            if (typeof message === 'function') {
                message = message(errors[key]);
            }
            return message;
        }).join(', ');
        el.$el.find('.help-block.errors').remove();
        el.$el.addClass('has-error').append(`<p class="help-block errors">${messages}</p>`);
    })
).register('ceb-field');
