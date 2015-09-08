import {ceb, method, on, attribute} from 'es6/lib/ceb.js';
import {actionify} from '../builders/actionify.js';
import {contextify} from '../builders/contextify.js';
import {handlerify} from '../builders/handlerify.js';
import {fromJS} from 'immutable';

ceb().augment(
    attribute('started').boolean(),
    method('attachedCallback').invoke(el => {
        el.started = true;
    }),
    method('detachedCallback').invoke(el => {
        el.started = false;
    }),
    handlerify()
).register('ui-app');

ceb().augment(
    contextify().value(fromJS({}))
).register('ui-context');


ceb().augment(
    actionify(on('click'))
).register('ui-action');

export function startCounterApp(app, ctx) {
    let counter = app.querySelector('#counter');

    // link the app to the context
    app.context = ctx;

    // increment the context's value
    app.handle('increment', (stream, params) => {
        return stream.map(ctx => {
            let value = ctx.get('value') + parseInt(params.value);
            return ctx.set('value', value);
        });
    });

    // reset the context's value
    app.handle('reset', stream => stream.map(ctx => ctx.set('value', 0)));

    // to update the counter input when the context is updated
    ctx.subscribe(stream => stream.onValue(ctx => counter.value = ctx.get('value')));

    // initialize the contex's value
    ctx.value = fromJS({
        value: 0
    });
}
