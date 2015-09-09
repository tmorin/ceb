import {Builder, property} from 'es6/lib/ceb.js';
import {noop, wrap} from 'es6/lib/utils.js';
import {Bus} from 'bacon';

let counter = 0;

function trigger(el, options, detail) {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(options.name, options.bubbles, options.cancellable, detail);
    return el.dispatchEvent(evt);
}

function createStream(el, id, apply, exposedName) {
    destroyStream(el, id, exposedName);
    let stream;
    stream = el[id] = new Bus();
    if (apply) {
        stream = apply.call(el, el, el[id]) || stream;
    }
    if (exposedName) {
        el.streams[exposedName] = stream;
    }
    return stream;
}

function destroyStream(el, id, exposedName) {
    if (el.streams && el.streams[exposedName]) {
        delete el.streams[exposedName];
    }
    if (el[id]) {
        el[id].end();
        delete el[id];
        delete el[`${id}Value`];
    }
}

export class BaconBuilder extends Builder {

    constructor(builder) {
        super();
        this.data = {builder};
    }

    apply(fn) {
        this.data.apply = fn;
        return this;
    }

    expose(name) {
        this.data.exposedName = name;
        return this;
    }

    trigger(name, bubbles = true, cancellable = true) {
        this.data.dispachedEvent = {name, bubbles, cancellable};
        return this;
    }

    build(proto, on) {

        let id = `_cebBaconifyBus${counter++}`,
            apply = this.data.apply,
            exposedName = this.data.exposedName,
            dispachedEvent = this.data.dispachedEvent,
            builder = this.data.builder;

        if (exposedName && !Object.getOwnPropertyDescriptor(proto, 'streams')) {
            property('streams').immutable().value({}).build(proto, on);
        }

        on('before:createdCallback').invoke(el => {
            createStream(el, id, apply, exposedName);
        });

        on('before:attachedCallback').invoke(el => {
            let stream = createStream(el, id, apply, exposedName);
            if (dispachedEvent) {
                stream.onValue(value => trigger(el, dispachedEvent, value));
            }
        });

        on('before:detachedCallback').invoke(el => {
            destroyStream(el, id, exposedName);
        });

        if (builder && builder.data.invoke) {
            let invoke = builder.data.invoke || noop();
            builder.data.invoke = wrap(invoke, (next, el, evt, target) => {
                el[id].push(evt);
                return next(el, evt, target);
            });
            builder.build(proto, on);
        } else if (builder && builder.data.propName) {
            builder.data.descriptorValue = false;
            let setter = builder.data.setter || ((el, value) => value);
            let getter = builder.data.getter || noop();
            builder.data.setter = wrap(setter, (next, el, value) => {
                el[id].push(value);
                el[`${id}Value`] = value;
                return next(el, value);
            });
            builder.data.getter = wrap(getter, (next, el) => {
                var value = next(el);
                return value || el[`${id}Value`];
            });
            builder.build(proto, on);
        }
    }
}

export function baconify(builder) {
    return new BaconBuilder(builder);
}