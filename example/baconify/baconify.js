import {Builder, property} from 'es6/lib/ceb.js';
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
        el[id].unsubAll();
        el[id] = null;
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

    trigger(name, bubbles = true, cancellable = true) {
        this.data.dispachedEvent = {name, bubbles, cancellable};
        return this;
    }

    build(proto, on) {

        let id = `_cebBaconifyBus-${counter++}`,
            apply = this.data.apply,
            exposedName = this.data.exposedName,
            dispachedEvent = this.data.dispachedEvent;

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

        if (this.data.builder) {
            this.data.builder.invoke((el, evt) => {
                el[id].push(evt);
            }).build(proto, on);
        }
    }
}

export function baconify(builder) {
    return new BaconBuilder(builder);
}
