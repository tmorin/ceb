import MethodBuilder from './builder/MethodBuilder';
import PropertyBuilder from './builder/PropertyBuilder';
import CustomElementBuilder from './builder/CustomElementBuilder';

export function ceb() {
    return new CustomElementBuilder();
}

export function property(name) {
    return new PropertyBuilder(name);
}

export function method(name) {
    return new MethodBuilder(name);
}
