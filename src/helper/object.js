// obviously close to underscorejs and lodash ;)

import {isFunction} from './type.js';

/**
 * Resolve the value of propName into object.
 * If the value is a function, it will be executed.
 * @param {!Object} object the object
 * @param {!string} propName the property name
 * @return the resolved value.
 */
export function result(object, propName) {
    let value = object[propName];
    return isFunction(value) ? value() : value;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination object.
 * @param {!Object} destination the destination object
 * @param {...Object} [sources] the source objects
 * @returns {Object} the destination object
 */
export function assign(destination, ...sources) {
    return [destination].concat(sources).reduce((target, source) => {
        return Object.keys(Object(source)).reduce((target, key) => {
            target[key] = source[key];
            return target;
        }, target);
    });
}
