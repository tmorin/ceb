// obviously close to underscorejs and lodash ;)

import {isArray, isFunction} from './type.js';

/**
 * Flattens a nested array.
 * @param {!Array} array the array to flatten
 * @returns {Array} the new flattened array
 */
export function flatten(array) {
    return array.reduce((a, b) => isArray(b) ? a.concat(flatten(b)) : a.concat(b), []);
}

/**
 * For each objects, invoke the method called methName with the arguments args.
 * @param {!Array<Object>} objects the objects
 * @param {!string} methName the name of the method
 * @param {...*} args the arguments to invoke the method with
 * @return {Array} the array of results
 */
export function invoke(objects, methName, ...args) {
    if (isArray(objects)) {
        return objects.filter(obj => isFunction(obj[methName])).map(obj => obj[methName].apply(obj, args));
    }
    return [];
}
