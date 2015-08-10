import customElementBuilder from './builder/CustomElementBuilder';
import propertyBuilder from './builder/PropertyBuilder';
import attributeBuilder from './builder/AttributeBuilder';

export function ceb(data) {
    return customElementBuilder(name);
}
export default ceb;

export function property(propName) {
    return propertyBuilder(propName);
}

export function attribute(attName) {
    return attributeBuilder(attName);
}

