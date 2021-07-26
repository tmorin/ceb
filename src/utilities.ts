/**
 * Convert the string to the camel case notation (CamelCase-notation = camelCaseNotation).
 * @param string the string
 */
export function toCamelCase(string = '') {
    return string.toLowerCase()
        .split('-')
        .map((part, index) => index ? part.charAt(0).toUpperCase() + part.slice(1) : part).join('')
}

/**
 * Convert the string to the kebab case notation (KebabCase-notation = kebab-case-notation).
 * @param value the string
 */
export function toKebabCase(value: string = '') {
    return !value ? value : value
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-')
}
