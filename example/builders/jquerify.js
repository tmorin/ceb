import {noConflict} from 'jquery';
var $ = noConflict();

export class JquerifyBuilder {

    constructor() {
    }

    build(proto, on) {
        on('before:createdCallback').invoke(el => {
            el.$ = $;
            el.$el = $(el);
        });
    }
}

export function jquerify() {
    return new JquerifyBuilder();
}
