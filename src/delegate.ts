import {Builder} from './builder';
import {HooksRegistration} from './hook';

export class DelegateBuilder implements Builder {

    constructor() {
    }

    static attribute(attrName: string) {
        return new DelegateBuilder();
    }

    static property(propName: string) {
        return new DelegateBuilder();
    }

    static method(methName: string) {
        return new DelegateBuilder();
    }

    to(selector: string) {
        return this
    }

    attribute(attrName: string) {
        return this;
    }

    property(propName: string) {
        return this;
    }

    build(Constructor: Function, hooks: HooksRegistration) {

    }

}
