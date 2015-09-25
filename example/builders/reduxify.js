import {Builder, method, property} from 'es6/lib/ceb.js';
import {assign, partial, toArray} from 'es6/lib/utils.js';

export class ReduxBuilder extends Builder {

    constructor(store) {
        super();
        this.data = {store, actions: {}, listeners: []};
    }

    bind(actions) {
        this.data.bind = assign(this.data.actions, actions);
        return this;
    }

    subscribe(cb) {
        this.data.listeners.push(cb);
        return this;
    }

    build(proto, on) {
        let store = this.data.store;
        let actions = this.data.actions;
        let listeners = this.data.listeners;

        let boundActions = Object.keys(actions).reduce((boundActions, key) => {
            boundActions[key] = function () {
                return store.dispatch(actions[key].apply(null, toArray(arguments)));
            };
            return boundActions;
        }, {});

        property('store').immutable().value(store).build(proto, on);
        property('actions').immutable().value(boundActions).build(proto, on);

        method('registerListeners').invoke(el => {
            if (!el._unsubscribers) {
                el._unsubscribers = listeners.map(cb => el.store.subscribe(partial(cb, el)));
            }
        }).build(proto, on);

        method('unregisterListeners').invoke(el => {
            if (el._unsubscribers) {
                el._unsubscribers.forEach(fn => fn());
                el._unsubscribers = null;
            }
        }).build(proto, on);

        on('before:createdCallback').invoke(el => {
            el.registerListeners();
        });

        on('before:attachedCallback').invoke(el => {
            el.registerListeners();
        });

        on('before:detachedCallback').invoke(el => {
            el.unregisterListeners();
        });
    }

}

export function reduxify(store) {
    return new ReduxBuilder(store);
}

