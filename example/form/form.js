import {ceb, property, attribute, method, on} from '../../es6/lib/ceb.js';
import {dispatch, toArray} from '../../es6/lib/utils';
import {jquerify} from '../builders/jquerify.js';

const CHECKABLE_INPUT_TYPES = ['checkbox', 'radio'];

const SELECTABLE_FORM_CONTROLS = ['select'];

const BUILTIN_RULES = [{
    name: 'required',
    filter(el) {
        return el.hasAttribute('required');
    },
    apply(el) {
        if (CHECKABLE_INPUT_TYPES.indexOf((el.type || '').toLowerCase()) > -1) {
            return !(el.checked);
        }
        if (SELECTABLE_FORM_CONTROLS.indexOf((el.tagname || '').toLowerCase()) > -1) {
            return el.selectedOptions.length < 1;
        }
        if ('value' in el) {
            return el.value.trim().length < 1;
        }
        return false;
    }
}, {
    name: 'minlength',
    filter(el) {
        return el.hasAttribute('minlength');
    },
    apply(el) {
        var minlength = parseInt(el.getAttribute('minlength')) || 0;
        if ('value' in el && el.value) {
            return el.value.trim().length < minlength ? {minlength} : false;
        }
        return false;
    }
}, {
    name: 'maxlength',
    filter(el) {
        return el.hasAttribute('maxlength');
    },
    apply(el) {
        var maxlength = parseInt(el.getAttribute('maxlength')) || 0;
        if ('value' in el && el.value) {
            return el.value.trim().length > maxlength ? {maxlength} : false;
        }
        return false;
    }
}];

const EXTERNAL_RULES = [];

export function addRule(name, filter = () => false, apply = () => false) {
    EXTERNAL_RULES.push({name, filter, apply});
}

function parseStringEventList(string) {
    return (string || '').split(',').map(name => name.toLowerCase()).filter(name => name);
}

export default ceb().proto(Object.create(HTMLFormElement.prototype)).extend('form').builders(
    jquerify(),

    attribute('prevent-submit').boolean(),

    property('validateOn').getter(el => parseStringEventList(el.getAttribute('validate-on'))),

    property('validateControlsOn').getter(el =>  parseStringEventList(el.getAttribute('validate-controls-on'))),

    property('rules').getter(el => BUILTIN_RULES.concat(EXTERNAL_RULES).concat(el._rules)),

    property('elementsAsArray').getter(el => toArray(el.elements)),

    method('createdCallback').invoke(el => {
        el.setAttribute('novalidate', '');
        el._rules = [];
    }),

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
    }),

    method('checkValidity').invoke(el => {
        let controls = el.elementsAsArray;

        let controlStates = controls.map(el.checkFormControlValidity, el);

        let formIsValid = controlStates.reduce((valid, state) => valid && state.valid, true);

         let formState = {
                valid: formIsValid,
                invalid: !formIsValid,
                controls: controlStates
        };

        dispatch(el, formIsValid ? 'valid' : 'invalid', {}, formState);
        controlStates.forEach(state => dispatch(state.element, state.valid ? 'valid' : 'invalid', {}, state));

        return formState;
    }),

    method('reportValidity').invoke(el => {
        let formState = el.checkValidity();
        if (formState.invalid) {
            let firstInvalidControl = formState.elementsAsArray.filter(state => state.invalid)[0];
            if (firstInvalidControl) {
                firstInvalidControl.element.focus();
            }
        }
    }),

    method('addRule').invoke((el, name, filter = () => false, apply = () => false) => {
        el.rules.push({name, filter, apply});
    }),

    on('reset').invoke(el => {
        let controlStates = el.elementsAsArray.map(control => ({
            element: control,
            valid: true,
            invalid: false,
            errors: {}
        }));

        let formState = {
            valid: true,
            invalid: false,
            controls: controlStates
        };

        dispatch(el, 'valid', {}, formState);
        controlStates.forEach(state => dispatch(state.element, 'valid', {}, state));
    }),

    on('submit').invoke((el, evt) => {
        if (el.preventSubmit) {
            evt.preventDefault();
        }
        if (el.validateOn.indexOf('submit') > -1) {
            el.reportValidity();
        }
    }),

    on('change, input').invoke((el, evt) => {
        let formControl = evt.target;
        let noValidateOn = parseStringEventList(formControl.getAttribute('no-validate-on'));
        let validateOn = parseStringEventList(formControl.getAttribute('validate-on'))
            .concat(el.validateControlsOn)
            .filter(name => noValidateOn.indexOf(name) < 0);

        if (validateOn.indexOf(evt.type) > -1) {
            let state = el.checkFormControlValidity(formControl);
            dispatch(state.element, state.valid ? 'valid' : 'invalid', {}, state);
        }
    })
).register('ceb-form');
