// obviously close to underscorejs and lodash ;)

/**
 * Checks if value is a Function object.
 * @param [value] the value to check
 * @return {boolean} true if value is a function, else false.
 */
export function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
}

/**
 * Checks if value is undefined.
 * @param [value] the value to check
 * @return {boolean} true if value is undefined, else false.
 */
export function isUndefined(value) {
    return value === undefined;
}

/**
 * Checks if value is null.
 * @param [value] the value to check
 * @return {boolean} true if value is null, else false.
 */
export function isNull(value) {
    return value === null;
}

/**
 * Checks if value is a string.
 * @param [value] the value to check
 * @return {boolean} true if value is a string, else false.
 */
export function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * Checks if value is an array.
 * @param [value] the value to check
 * @return {boolean} true if value is an array, else false.
 */
export function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}
