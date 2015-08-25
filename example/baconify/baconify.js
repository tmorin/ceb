import {Builder} from 'es6/lib/ceb.js';
import {Bus} from 'bacon';

let counter = 0;

export class BaconBuilder extends Builder {

    constructor(builder) {
        super();
        this.data = {builder};
    }

    apply(fn) {
        this.data.apply = fn;
        return this;
    }

    build(proto, on) {
        let id = `_cebBaconifyBus-${counter++}}`,
            apply = this.data.apply;

        on('before:attachedCallback').invoke(el => {
            el[id] = new Bus();
            apply.call(el, el, el[id]);
        });

        on('before:detachedCallback').invoke(el => {
            el[id].dispose();
        });

        this.data.builder.invoke((el, evt) => {
            el[id].push(evt);
        }).build(proto, on);
    }
}

export function baconify(builder) {
    return new BaconBuilder(builder);
}
