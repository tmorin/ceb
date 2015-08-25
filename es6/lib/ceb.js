import {CustomElementBuilder} from './builder/CustomElementBuilder.js';
import {PropertyBuilder} from './builder/PropertyBuilder.js';
import {AttributeBuilder, getAttValue, setAttValue} from './builder/AttributeBuilder.js';
import {DelegateBuilder} from './builder/DelegateBuilder.js';
import {MethodBuilder} from './builder/MethodBuilder.js';
import {TemplateBuilder, applyTemplate} from './builder/TemplateBuilder.js';
import {OnBuilder} from './builder/OnBuilder.js';
import {Builder as BuilderType} from './builder/Builder.js';

/**
 * The base builder type
 * @type {Builder} the builder
 */
export const Builder = BuilderType;

/**
 * Get a new custom element builder.
 * @returns {CustomElementBuilder} the custom element builder
 */
export function ceb() {
    return new CustomElementBuilder();
}

/**
 * Get a new property builder.
 * @param {!string} propName the name of the property
 * @returns {PropertyBuilder} the property builder
 */
export function property(propName) {
    return new PropertyBuilder(propName);
}

/**
 * Get a new attribute builder.
 * @param {!string} attrName the name of the attribute
 * @returns {AttributeBuilder} the attribute builder
 */
export function attribute(attrName) {
    return new AttributeBuilder(attrName);
}
attribute.getAttValue = getAttValue;
attribute.setAttValue = setAttValue;

/**
 * Get a new method builder.
 * @param {!string} methName the name of the method
 * @returns {MethodBuilder} the method builder
 */
export function method(methName) {
    return new MethodBuilder(methName);
}

/**
 * Get a new delegate builder.
 * @param {!PropertyBuilder|AttributeBuilder} builder the property or attribute builder
 * @returns {DelegateBuilder} the delegate builder
 */
export function delegate(builder) {
    return new DelegateBuilder(builder);
}

/**
 * Get a new template builder.
 * @param {!string|Function} tpl the string or function template
 * @returns {TemplateBuilder} the template builder
 */
export function template(tpl) {
    return new TemplateBuilder(tpl);
}
template.applyTemplate = applyTemplate;

/**
 * Get a new on builder.
 * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
 * @returns {OnBuilder} the on builder
 */
export function on(events) {
    return new OnBuilder(events);
}
