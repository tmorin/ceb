import customElementBuilder from './builder/CustomElementBuilder';
import propertyBuilder from './builder/PropertyBuilder';
import attributeBuilder from './builder/AttributeBuilder';
import delegateBuilder from './builder/DelegateBuilder';
import methodBuilder from './builder/MethodBuilder';

export function ceb(data) {
    return customElementBuilder(name);
}
export default ceb;

export function property(propName) {
    return propertyBuilder(propName);
}

export function attribute(attrName) {
    return attributeBuilder(attrName);
}

export function delegate(attrName) {
    return delegateBuilder(attrName);
}

export function method(methName) {
    return methodBuilder(methName);
}

