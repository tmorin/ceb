import {noConflict} from 'jquery';
var $ = noConflict();
import {Builder} from '../../es6/lib/ceb.js';

export class JquerifyBuilder extends Builder {

    constructor() {
        super();
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
