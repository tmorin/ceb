import {isFunction} from '../helper/types.js';
import {partial, bind} from '../helper/functions.js';
import {toArray} from '../helper/converters.js';
import Builder from './Builder';

/**
 * The method builder.
 * Its goal is to provide a way to define a method.
 */
export class MethodBuilder extends Builder {

    /**
     * @param {!string} methName the name of the method
     */
    constructor(methName) {
        super();
        /**
         * @ignore
         */
        this.data = {methName, wrappers: []};
    }

    /**
     * To do something when invoked.
     * @param {!function(el: HTMLElement, args: ...*)} fn the method's logic
     * @returns {MethodBuilder} the builder
     */
    invoke(fn) {
        if (isFunction(fn)) {
            this.data.invoke = fn;
        }
        return this;
    }

    /**
     * To do something around the invocation.
     * @param {...function(el: HTMLElement, args: ...*)} wrappers a set of wrappers
     * @returns {MethodBuilder} the builder
     */
    wrap(...wrappers) {
        this.data.wrappers = this.data.wrappers.concat(wrappers);
        return this;
    }

    /**
     * Skip the custom element instance as first argument.
     * It's required when playing with native method with delegration or wrapping.
     * @returns {MethodBuilder} the builder
     */
    native() {
        this.data.native = true;
        return this;
    }

    /**
     * Logic of the builder.
     * @param {!ElementBuilder.context.p} proto the prototype
     * @param {!ElementBuilder.on} on the method on
     */
    build(proto, on) {
        let data = this.data;

        if (data.invoke) {
            proto[data.methName] = function () {
                let args = toArray(arguments);
                if (!data.native && args[0] != this) {
                    args.unshift(this);
                }
                return data.invoke.apply(this, args);
            };
        }

        if (data.wrappers.length) {
            on('before:createdCallback').invoke(el => {
                if (isFunction(el[data.methName])) {
                    let lastIndex = data.wrappers.length - 1,
                        original = el[data.methName],
                        target = function target() {
                            let args = toArray(arguments);
                            if (!data.native) {
                                args.shift();
                            }
                            original.apply(el, args);
                        };
                    el[data.methName] = data.wrappers.reduce((next, current, index) => {
                        if (index === lastIndex) {
                            return bind(data.native ? partial(current, next) : partial(current, next, el), el);
                        }
                        return bind(partial(current, next), el);
                    }, target);

                }
            });
        }
    }
}

/**
 * Get a new method builder.
 * @param {!string} methName the name of the method
 * @returns {MethodBuilder} the method builder
 */
export function method(methName) {
    return new MethodBuilder(methName);
}
