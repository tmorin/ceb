import customElementBuilder from './builder/CustomElementBuilder';
import propertyBuilder from './builder/PropertyBuilder';
import attributeBuilder from './builder/AttributeBuilder';
import delegateBuilder from './builder/DelegateBuilder';
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
 * Get a new delegate builder.
 * @param {!PropertyBuilder|AttributeBuilder} builder the property or attribute builder
 * @returns {DelegateBuilder} the delegate builder
 */
export function delegate(builder) {
    return delegateBuilder(builder);
}
