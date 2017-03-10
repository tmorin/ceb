import {isFunction} from '../helper/types.js';
import {noop} from '../helper/functions.js';
import {toArray} from '../helper/converters.js';
import Builder from './Builder';

/**
 * The on builder.
 * Its goal is to provide a way to listen events coming from the custom element.
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
        this.data = {events, invoke: noop};
    }

    /**
     * To do something when events occurred.
     * The target argument is by default the custom element.
     * When the delegate feature is used, target is the matched element.
     * @param {!function(el: HTMLElement, evt: Event, target: HTMLElement)} fn the event's logic
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
     * @param {!ElementBuilder.context.p} proto the prototype
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
            el.__cebOnHandlers = [];
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

            el.__cebOnHandlers = events
                .map(([name, target]) => [name, target ? el.querySelector(target) : el])
                .filter(([name, target]) => !!target)
                .map(([name, target]) => [target, name, listener, capture])
                .concat(el.__cebOnHandlers);

            el.__cebOnHandlers.forEach(([target, name, listener, capture]) =>
                target.addEventListener(name, listener, capture));
        });

        on('before:detachedCallback').invoke((el) => {
            el.__cebOnHandlers.forEach(([target, name, listener, capture]) =>
                target.removeEventListener(name, listener, capture));
            el.__cebOnHandlers = [];
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

/**
 * Get a new on builder already setup with all mouse events: click, mousedown, mouseup, mouseover, mouseout, mousemove, contextmenu, dblclick.
 * @returns {OnBuilder}
 */
on.mouse = function () {
    return on('click, mousedown, mouseup, mouseover, mouseout, mousemove, contextmenu, dblclick');
};

/**
 * Get a new on builder already setup with all keyboard events: keydown, keypress, keyup.
 * @returns {OnBuilder}
 */
on.keyboard = function () {
    return on('keydown, keypress, keyup');
};
