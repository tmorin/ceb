import {ceb, attribute, method} from 'es6/lib/ceb.js';

export default ceb().augment(
    attribute('started').boolean(),

    method('attachedCallback').invoke(el => {
        el.started = true;
    }),

    method('detachedCallback').invoke(el => {
        el.started = false;
    })
).register('ui-app');
