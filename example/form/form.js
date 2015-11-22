import {ceb, property, attribute, method, on} from '../../es6/lib/ceb.js';
import {dispatch, toArray} from '../../es6/lib/utils';
import {jquerify} from '../builders/jquerify.js';

const FORM_CONTROL_TYPES = ['input', 'textarea', 'select'];

const REQUIRABLE_INPUT_TYPES = ['text', 'search', 'url', 'tel', 'email', 'password', 'date', 'time', 'number', 'checkbox', 'radio', 'file'];

function isIn(value, array) {
    return array.indexOf(value.toLowerCase());
}

const DEFAULT_RULES = [{
    name: 'required',
    filter: el => {
        return el.hasAttribute('required');
    },
    apply: el => {
        if ('checked' in el) {
            return !(el.checked);
        }
        if ('selectedOptions' in el) {
            return el.selectedOptions.length < 1;
        }
        if ('value' in el) {
            return el.value.trim().length < 1;
        }
        return false;
    }
}];

export default ceb().proto(Object.create(HTMLFormElement.prototype)).extend('form').builders(
    jquerify(),

    attribute('prevent-submit').boolean(),

    property('rules'),

    method('createdCallback').invoke(el => {
        el.setAttribute('novalidate', '');
        el.rules = [].concat(DEFAULT_RULES);
    }),

    method('checkValidity').invoke(el => {
        let controls = toArray(el.querySelectorAll(FORM_CONTROL_TYPES.join(',')));

        controls.map(control => {
            var results = el.rules
                .filter(rule => rule.filter(control))
                .reduce((result, rule) => {
                    result[rule.name] = rule.apply(control);
                    return result;
                }, {});
            return {control, results}
        });

        let formIsInvalid = controls.map(({control, results}) => {
            let controlIsInvalid = Object.keys(results).reduce((r, k) => results[k], false);
            let controlEventName = controlIsInvalid ? 'invalid' : 'valid';
            dispatch(control, controlEventName);
            return controlIsInvalid;
        }).reduce((r, k) => results[k], false);

        let formEventName = formIsInvalid ? 'invalid' : 'valid';
        dispatch(el, formEventName);
    }),

    method('reportValidity').invoke(el => {
        el.checkValidity();
    }),

    method('addRule').invoke((el, rule) => {
        el.rules.push(rule);
    }),

    on('reset').invoke(el => {
    }),

    on('submit').invoke((el, evt) => {
        el.reportValidity();
        if (el.preventSubmit) {
            evt.preventDefault();
        }
    }),

    on('change').invoke((el, evt) => {
        var element = evt.target;
    })
).register('ceb-form');
