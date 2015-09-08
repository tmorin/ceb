import {Builder, property, method, on} from 'es6/lib/ceb.js';
import {baconify} from 'baconify';
import {once} from 'bacon';

export class ContextifyBuilder extends Builder {

    constructor() {
        super();
        this.data = {name: 'UI-CHANGE'};
    }

    name(name) {
        this.data.name = name;
        return this;
    }

    value(value) {
        this.data.value = value;
        return this;
    }

    build(proto, cebOn) {
        // A list of subscribers.
        property('subscribers')
            .immutable()
            .value(() => ([]))
            .build(proto, cebOn);

        // The reactive context's value
        // an event will be triggered when the property is updated.
        baconify(property('value').value(this.data.value))
            .trigger(this.data.name, false, false)
            .build(proto, cebOn);

        // Watch the reactive context's value
        // to execute the subscribers.
        // Subscriber will not be executed if
        // the context's value has not been mutated.
        baconify(on(this.data.name))
            .apply((el, stream) => {
                stream
                    .map('.detail')
                    .skipDuplicates()
                    .onValue(ctx => el.subscribers.forEach(subscriber => subscriber(once(ctx))));
            })
            .build(proto, cebOn);

        // Register a subscriber.
        method('subscribe')
            .invoke((el, subscriber) => {
                el.subscribers.push(subscriber);
                return () => el.subscribers.splice(el.subscribers.indexOf(subscriber), 1);
            })
            .build(proto, cebOn);
    }
}

export function contextify() {
    return new ContextifyBuilder();
}

