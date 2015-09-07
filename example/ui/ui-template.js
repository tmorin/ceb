import {ceb, method} from 'es6/lib/ceb.js';
import {trigger} from './utils.js';
import itemplate from 'itemplate';
import idom from 'idom';

export default ceb().extends('script').proto(Object.create(HTMLScriptElement.prototype)).augment(
    method('createdCallback').invoke(el => {
        el.render = itemplate.compile(el.textContent, idom);
        trigger(el, 'ui-ready');
    }),

    method('patch').invoke((el, dest, ctx) => {
        idom.patch(dest, el.render, ctx);
    })
).register('ui-template');
