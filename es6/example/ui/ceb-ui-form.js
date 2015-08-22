import {ceb, property,  attribute, on} from '../../lib/ceb.js';
import {toArray} from 'lodash/index';

export default ceb().extends('form').proto(Object.create(HTMLFormElement.prototype)).augment(

    property('params').getter(el => {
        return toArray(el.querySelectorAll('input[name]'))
            .map(i => [i.getAttribute('name'), i.value])
            .reduce((a, [name, value]) => {
                a[name] = value;
                return a;
            }, {});
    }),

    attribute('action-name'),

    on('submit').skip().invoke((el) => {
        el.dispatchEvent(new CustomEvent('ceb-action', {
            bubbles: true,
            detail: {
                name: el.actionName,
                params: el.params
            }
        }));
    })
).register('ceb-ui-form');
