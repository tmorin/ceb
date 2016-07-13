import $ from 'jquery';
import {element, method, property, on} from 'ceb';

let cebFieldBuilder = element();

cebFieldBuilder.on('before:createdCallback').invoke(el => {
    el.$el = $(el);
});

cebFieldBuilder.builders(
    method('createdCallback').invoke(el => {
        el.$el.addClass('form-group').css('display', 'block');
    })
);

cebFieldBuilder.builders(
    property('messages').value({
        required: 'The field is required.',
        maxlength: data => `The value must be lower than ${data.maxlength} characters.`,
        minlength: data => `The value must be higher than ${data.minlength} characters.`
    })
);

cebFieldBuilder.on('before:createdCallback').invoke(el => {
    el._invalidControlStates = [];
});
cebFieldBuilder.builders(
    method('reportValidity').invoke(el => {
        let helpBlockContent = el._invalidControlStates.map(state => {
            let errors = state.errors;
            return Object.keys(errors).map(key => {
                let message = el.messages[key];
                if (typeof message === 'function') {
                    message = message(errors[key]);
                }
                return message;
            });
        }).join(', ');
        el.$el.removeClass('has-error').find('.help-block.errors').remove();
        if (helpBlockContent) {
            el.$el.addClass('has-error').append(`<p class="help-block errors">${helpBlockContent}</p>`);
        }
    })
);

cebFieldBuilder.builders(
    on('invalid').invoke((el, evt) => {
        let currentControlState = evt.detail;
        let persistedControlState = el._invalidControlStates.filter((state => {
            return state.element === currentControlState.element;
        }))[0];
        if (persistedControlState) {
            let index = el._invalidControlStates.indexOf(persistedControlState);
            el._invalidControlStates.splice(index, 1);
        }
        el._invalidControlStates.push(currentControlState);
        el.reportValidity();
    })
);

cebFieldBuilder.builders(
    on('valid').invoke((el, evt) => {
        let currentControlState = evt.detail;
        let persistedControlState = el._invalidControlStates.filter((state => {
            return state.element === currentControlState.element;
        }))[0];
        if (persistedControlState) {
            let index = el._invalidControlStates.indexOf(persistedControlState);
            el._invalidControlStates.splice(index, 1);
        }
        el.reportValidity();
    })
);

export default cebFieldBuilder.register('ceb-field');
