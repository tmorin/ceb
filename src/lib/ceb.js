import customElementBuilder from './builder/CustomElementBuilder';
import propertyBuilder from './builder/PropertyBuilder';
import attributeBuilder from './builder/AttributeBuilder';
import proxyBuilder from './builder/ProxyBuilder';
import methodBuilder from './builder/MethodBuilder';

/**
 * The base builder type
 * @type {Builder} the builder
 */
export * from './builder/Builder';

/**
 * Get a new custom element builder.
 * @returns {CustomElementBuilder} the custom element builder
 */
export function ceb() {
    return customElementBuilder();
}

/**
 * Get a new custom element builder.
 * @returns {CustomElementBuilder} the custom element builder
 */
export default ceb;

/**
 * Get a new property builder.
 * @param {!string} propName the name of the property
 * @returns {PropertyBuilder} the property builder
 */
export function property(propName) {
    return propertyBuilder(propName);
}

/**
 * Get a new attribute builder.
 * @param {!string} attrName the name of the attribute
 * @returns {AttributeBuilder} the attribute builder
 */
export function attribute(attrName) {
    return attributeBuilder(attrName);
}

/**
 * Get a new method builder.
 * @param {!string} methName the name of the method
 * @returns {MethodBuilder} the method builder
 */
export function method(methName) {
    return methodBuilder(methName);
}

/**
 * Get a new proxy builder.
 * @param {!PropertyBuilder|AttributeBuilder} builder the proxy builder
 * @returns {ProxyBuilder} the proxy builder
 */
export function proxy(builder) {
    return proxyBuilder(builder);
}
