import {method, property, assign, partial, toArray} from '../../src/ceb.js';

export class ReduxBuilder {

    constructor(store) {
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

        listeners.push((el) => el.state = el.store.getState().toJS());

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
            el.state = el.store.getState().toJS();
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

