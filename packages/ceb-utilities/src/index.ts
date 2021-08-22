/**
 * Convert the string to the camel case notation, i.e. `CamelCase-notation` => `camelCaseNotation`.
 * @param value the string
 */
export function toCamelCase(value: string): string {
    return value.toLowerCase()
        .split("-")
        .map((part, index) => index ? part.charAt(0).toUpperCase() + part.slice(1) : part)
        .join("") || value
}

/**
 * Convert the string to the kebab case notation, i.e. `KebabCase-notation` => `kebab-case-notation`.
 * @param value the string
 */
export function toKebabCase(value: string): string {
    return value.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map(x => x.toLowerCase())
        ?.join("-") || value
}
