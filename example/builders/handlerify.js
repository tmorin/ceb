import {Builder, property, attribute, method, on} from 'es6/lib/ceb.js';
import {trigger} from 'es6/lib/utils.js';
import {baconify} from 'baconify';
import {once} from 'bacon';

function execute(el, action) {
    return el.handlers[action.name](once(el.context.value), action.params);
}

export class HandlerifyBuilder extends Builder {

    constructor() {
        super();
        this.data = {name: 'UI-EXECUTE'};
    }

    name(name) {
        this.data.name = name;
        return this;
    }

    build(proto, cebOn) {
        // the id of the context element
        attribute('context-id')
            .build(proto, cebOn);

        // the context element
        property('context')
            .setter((el, value) => el._uiAppContext = value)
            .getter(el => el._uiAppContext || document.getElementById(el.contextId))
            .build(proto, cebOn);

        // the handlers
        property('handlers')
            .immutable()
            .value(()=>({}))
            .build(proto, cebOn);

        // to register an handler
        method('handle')
            .invoke((el, name, handler) => {
                el.handlers[name] = handler;
                return () => delete el.handlers[name];
            })
            .build(proto, cebOn);

        // to dispatch an action
        method('dispatch')
            .invoke((el, name, params) => {
                trigger(el, {
                    name: this.data.name,
                    bubbles: true,
                    cancellable: true
                }, {name, params});
            })
            .build(proto, cebOn);

        // to execute handlers according to the action's event
        baconify(on(this.data.name))
            .apply((el, stream) => {
                stream
                    .filter(evt => el.handlers[evt.detail.name])
                    .doAction('.stopPropagation')
                    .map('.detail')
                    .flatMapFirst(action => execute(el, action))
                    .onValue(context => el.context.value = context);
            })
            .build(proto, cebOn);
    }
}

export function handlerify() {
    return new HandlerifyBuilder();
}

