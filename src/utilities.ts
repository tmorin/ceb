/**
 * Convert the string to the camel case notation (CamelCase-notation = camelCaseNotation).
 * @param string the string
 */
export function toCamelCase(string = '') {
    return string.toLowerCase()
        .split('-')
        .map((part, index) => index ? part.charAt(0).toUpperCase() + part.slice(1) : part).join('');
}

/**
 * Convert the string to the kebab case notation (KebabCase-notation = kebab-case-notation).
 * @param value the string
 */
export function toKebabCase(value: string = '') {
    return !value ? value : value
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
}

/**
 * Checks if value is undefined.
 * @param value the value to check
 */
export function isUndefined(value?: any): boolean {
    return value === undefined;
}

/**
 * Checks if value is null.
 * @param value the value to check
 */
export function isNull(value?: any): boolean {
    return value === null;
}

/**
 * Converts value to an array.
 * @param value the value to convert
 */
export function toArray<T>(value: any): Array<T> {
    return Array.prototype.slice.call(value);
}
