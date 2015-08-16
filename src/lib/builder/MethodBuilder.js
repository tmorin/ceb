import isFunction from 'lodash/lang/isFunction';
import toArray from 'lodash/lang/toArray';

import noop from 'lodash/utility/noop';

import wrap from 'lodash/function/wrap';

import Builder from './Builder';

/**
 * The method builder.
 * Its goal is to provide a user friendly way to define a method.
 * @extends {Builder}
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
        this.data = {methName, invoke: noop, wrappers: []};
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
     * @override
     */
    build(proto, on) {
        var data = this.data;

        proto[data.methName] = function () {
            data.invoke.apply(this, [this].concat(toArray(arguments)));
        };

        on('after:builders').invoke(() => {
            data.wrappers.forEach(wrapper => {
                data.invoke = wrap(data.invoke, wrapper);
            });
        });
    }
}

/**
 * @ignore
 */
export default function helper(methName) {
    return new MethodBuilder(methName);
}
