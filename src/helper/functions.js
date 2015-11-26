// obviously close to underscorejs and lodash ;)

import {toArray} from './converters.js';

/**
 * Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
 * @param {!Function} fn the function to partially apply arguments to
 * @param {...} args the arguments to be partially applied
 * @returns {Function} the new partially applied function
 */
export function partial(fn, ...args) {
    return function () {
        return fn.apply(this, args.concat(toArray(arguments)));
    };
}

/**
 * Creates a function that invokes fn with context the context ctx.
 * @param {!Function} fn the function to bind
 * @param ctx the context
 * @returns {Function} the new bound function
 */
export function bind(fn, ctx) {
    return function () {
        return fn.apply(ctx, toArray(arguments));
    };
}

/**
 * An empty function doing nothing.
 * @returns {Function} a new function doing nothing
 */
export function noop() {
    return function () {
    };
}
