import {isFunction} from '../helper/type.js';
import {noop} from '../helper/function.js';
import {toArray} from '../helper/converter.js';

/**
 * The on builder.
 * Its goal is to provide a way to listen events coming from the custom element.
 * @extends {Builder}
 */
export class OnBuilder {

    /**
     * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
     */
    constructor(events) {
        /**
         * @ignore
         */
        this.data = {events, invoke: noop};
    }

    /**
     * To do something when events occurred.
     * The target argument is by default the custom element.
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
     * To attach the event on the capture phase insteadof of on the bubble phase.
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
     * Logic of the builder.
     * @param {!ElementBuilder.context.proto} proto the prototype
     * @param {!ElementBuilder.on} on the method on
     */
    build(proto, on) {
        let events = this.data.events.split(',').map(event => event.trim().split(' ')),
            capture = !!this.data.capture,
            invoke = this.data.invoke,
            selector = this.data.selector,
            stopPropagation = this.data.stopPropagation,
            preventDefault = this.data.preventDefault;

        on('before:createdCallback').invoke((el) => {
            el._cebOnHandlers = [];
        });

        on('before:attachedCallback').invoke((el) => {
            let listener = evt => {
                if (selector) {
                    let target = toArray(el.querySelectorAll(selector)).filter(el => el === evt.target || el.contains(evt.target))[0];
                    if (target) {
                        if (stopPropagation) {
                            evt.stopPropagation();
                        }
                        if (preventDefault) {
                            evt.preventDefault();
                        }
                        invoke(el, evt, target);
                    }
                } else {
                    if (stopPropagation) {
                        evt.stopPropagation();
                    }
                    if (preventDefault) {
                        evt.preventDefault();
                    }
                    invoke(el, evt, el);
                }
            };

            el._cebOnHandlers = events
                .map(([name, target]) => [name, target ? el.querySelector(target) : el])
                .filter(([name, target]) => !!target)
                .map(([name, target]) => {
                    target.addEventListener(name, listener, capture);
                    return [target, name, listener, capture];
                });

            el._cebOnHandlers.forEach(([target, name, listener, capture]) => target.addEventListener(name, listener, capture));

        });

        on('before:detachedCallback').invoke((el) => {
            el._cebOnHandlers.forEach(([target, name, listener, capture]) => target.removeEventListener(name, listener, capture));
        });
    }

}

/**
 * Get a new on builder.
 * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
 * @returns {OnBuilder} the on builder
 */
export function on(events) {
    return new OnBuilder(events);
}
