import {element, property, attribute, method, on, toArray, dispatchCustomEvent} from 'ceb';

import {RULES} from './rules.js';

let cebFormBuilder = element().base(Object.create(HTMLFormElement.prototype), 'form');

cebFormBuilder.builders(
    attribute('prevent-submit').boolean(),
    on('submit').invoke((el, evt) => {
        if (el.preventSubmit) {
            evt.preventDefault();
        }
    })
);

cebFormBuilder.builders(
    method('createdCallback').invoke(el => {
        el.setAttribute('novalidate', '');
    })
);

cebFormBuilder.builders(
    property('rules').getter(el => RULES.concat(el._rules || [])),
    method('addRule').invoke((el, name, filter = () => false, apply = () => false) => {
        if (!el._rules) {
            el._rules = [];
        }
        el._rules.push({name, filter, apply});
    })
);

cebFormBuilder.builders(
    method('checkFormControlValidity').invoke((el, control) => {
        let errors = el.rules
            .filter(rule => rule.filter(control))
            .reduce((result, rule) => {
                result[rule.name] = rule.apply(control);
                return result;
            }, {});
        let controlIsInvalid = Object.keys(errors).reduce((invalid, key) => invalid ? invalid : errors[key], false);
        return {
            element: control,
            valid: !controlIsInvalid,
            invalid: controlIsInvalid,
            errors: errors
        };
    })
);

cebFormBuilder.builders(
    property('elementsAsArray').getter(el => toArray(el.elements)),
    method('checkValidity').invoke(el => {
        let controls = el.elementsAsArray;
        let controlStates = controls.map(el.checkFormControlValidity, el);
        let formIsValid = controlStates.reduce((valid, state) => valid && state.valid, true);
        return {
            form: el,
            valid: formIsValid,
            invalid: !formIsValid,
            controls: controlStates
        };
    })
);

cebFormBuilder.builders(
    method('reportValidity').invoke(el => {
        let formState = el.checkValidity();
        let formEventType = formState.valid ? 'valid' : 'invalid';
        dispatchCustomEvent(el, formEventType, {
            detail: formState
        });
        formState.controls.forEach(controlState => {
            let controlEventType = controlState.valid ? 'valid' : 'invalid';
            dispatchCustomEvent(controlState.element, controlEventType, {
                detail: controlState
            });
        });
        let firstElement = el.elementsAsArray[0];
        if (firstElement) {
            firstElement.focus();
        }
        return formState;
    })
);


function toEventTypes(string) {
    return (string || '').split(',').map(name => name.toLowerCase()).filter(name => name);
}

cebFormBuilder.on('after:createdCallback').invoke(el => {
    // keep a reference of the listener
    el._validateFormListener = function (evt) {
        let formState = el.reportValidity();
        if (formState.invalid) {
            evt.stopPropagation();
        }
    };
});
cebFormBuilder.on('before:attachedCallback').invoke(el => {
    // add listeners when attached
    toEventTypes(el.validateOn).forEach(type => el.addEventListener(type, el._validateFormListener));
});
cebFormBuilder.on('before:detachedCallback').invoke(el => {
    // remove listeners when attached
    toEventTypes(el.validateOn).forEach(type => el.removeEventListener(type, el._validateFormListener));
});
cebFormBuilder.builders(
    // dynamically add/remove listeners according to the updated value
    attribute('validate-on').listen((el, oldVal, newVal) => {
        toEventTypes(oldVal).forEach(type => el.removeEventListener(type, el._validateFormListener));
        toEventTypes(newVal).forEach(type => el.addEventListener(type, el._validateFormListener));
    })
);

cebFormBuilder.on('after:createdCallback').invoke(el => {
    // keep a reference of the listener
    el._validateControlListener = function (evt) {
        let control = evt.target;
        let controlState = el.checkFormControlValidity(control);
        let controlEventType = controlState.valid ? 'valid' : 'invalid';
        dispatchCustomEvent(control, controlEventType, {
            detail: controlState
        });
    };
});
cebFormBuilder.on('before:attachedCallback').invoke(el => {
    // add listeners when attached
    toEventTypes(el.validateControlOn).forEach(type => el.addEventListener(type, el._validateControlListener));
});
cebFormBuilder.on('before:detachedCallback').invoke(el => {
    // remove listeners when attached
    toEventTypes(el.validateControlOn).forEach(type => el.removeEventListener(type, el._validateControlListener));
});
cebFormBuilder.builders(
    // dynamically add/remove listeners according to the updated value
    attribute('validate-control-on').listen((el, oldVal, newVal) => {
        toEventTypes(oldVal).forEach(type => el.removeEventListener(type, el._validateControlListener));
        toEventTypes(newVal).forEach(type => el.addEventListener(type, el._validateControlListener));
    })
);

cebFormBuilder.builders(
    on('reset').invoke(el => {
        let controlStates = el.elementsAsArray.map(control => ({
            element: control,
            valid: true,
            invalid: false,
            errors: {}
        }));
        let formState = {
            form: el,
            valid: true,
            invalid: false,
            controls: controlStates
        };
        dispatchCustomEvent(el, 'valid', {
            detail: formState
        });
        controlStates.forEach(state => dispatchCustomEvent(state.element, 'valid', {
            detail: state
        }));
    })
);

export default cebFormBuilder.register('ceb-form');
