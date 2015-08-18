import isFunction from 'lodash/lang/isFunction.js';
import toArray from 'lodash/lang/toArray.js';
import find from 'lodash/collection/find.js';
import noop from 'lodash/utility/noop.js';

import Builder from './Builder.js';

/**
 * The on builder.
 * Its goal is to provide a way to listen events coming from the custom element.
 * @extends {Builder}
 */
export class OnBuilder extends Builder {

    /**
     * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
     */
    constructor(events) {
        super();
        /**
         * @ignore
         */
        this.data = {events, invoke:noop};
    }

    /**
     * To do something when events occurred.
     * The target arugment is by default the custom element.
     * When the delegate feature is used, target is the matched element.
     * @param {!function(el: HTMLElement, evt: DOMEvent, target: HTMLElement)} fn the event's logic
     * @returns {OnBuilder} the builder
     */
    invoke(fn) {
        if (isFunction(fn)) {
            this.data.invoke = fn;
        }
        return this;
    }

    /**
     * To attach the event on the capture phase instread of on the bubble phase.
     * @returns {OnBuilder} the builder
     */
    capture() {
        this.data.capture = true;
        return this;
    }

    /**
     * To delegate the event.
     * @param {!string} selector the selector
     * @returns {OnBuilder} the builder
     */
    delegate(selector) {
        this.data.selector = selector;
        return this;
    }

    /**
     * To prevent the default behavior.
     * @returns {OnBuilder} the builder
     */
    prevent() {
        this.data.preventDefault = true;
        return this;
    }

    /**
     * To stop the event propagation.
     * @returns {OnBuilder} the builder
     */
    stop() {
        this.data.stopPropagation = true;
        return this;
    }

    /**
     * To prevent the default behavior and to stop the event propagation.
     * @returns {OnBuilder} the builder
     */
    skip() {
        return this.prevent().stop();
    }

    /**
     * @ignore
     */
    build(proto, on) {
        var events = this.data.events.split(' ').map(event => event.trim());
        var capture = !!this.data.capture;
        var invoke = this.data.invoke;
        var selector = this.data.selector;
        var stopPropagation = this.data.stopPropagation;
        var preventDefault = this.data.preventDefault;
        var listener;

        on('before:attachedCallback').invoke((el) => {
            listener = evt => {
                if (stopPropagation) {
                    evt.stopPropagation();
                }
                if (preventDefault) {
                    evt.preventDefault();
                }
                if (selector) {
                    var target = find(toArray(el.querySelectorAll(selector)), el => el === evt.target || el.contains(evt.target));
                    if (target) {
                        invoke(el, evt, target);
                    }
                } else {
                    invoke(el, evt, el);
                }
            };
            events.forEach(event => el.addEventListener(event, listener, capture));
        });

        on('before:detachedCallback').invoke((el) => {
            events.forEach(event => el.removeEventListener(event, listener, capture));
        });
    }

}

/**
 * @ignore
 */
export default function helper(tpl) {
    return new OnBuilder(tpl);
}

