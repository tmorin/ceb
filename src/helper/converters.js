// obviously close to underscorejs and lodash ;)

/**
 * Converts value to an array.
 * @param [value] the value to convert
 * @returns {Array} the converted array
 */
export function toArray(value) {
    return Array.prototype.slice.call(value);
}

/**
 * Converts string to camel case.
 * @param {string} [string=''] the string to convert
 * @return {string} the camel cased string
 */
export function toCamelCase(string = '') {
    return string.toLowerCase().split('-').map((part, index) => index ? part.charAt(0).toUpperCase() + part.slice(1) : part).join('');
}
