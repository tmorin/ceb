import {ceb, property, method} from 'es6/lib/ceb.js';

import {Bus} from 'bacon';

let commands = new Bus();

let events = new Bus();

let actions = [];

export let HTMLUiContext = ceb().augment(
    property('store'),

    method('register').invoke((el, ...actions) => {
        actions.forEach(action => {});
    }),

    method('unregister').invoke((el, ...names) => {
        names.forEach(name => {});
    }),

    method('dispatch').invoke((el, action) => {
        commands.push(action);
    }),

    method('subscribe').invoke((el, listeners) => {
    })
).register('ui-context');
