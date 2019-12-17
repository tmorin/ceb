import {Builder, CustomElementConstructor} from './builder';
import {HooksRegistration} from './hook';
import {AttributeBuilder} from './attribute';

export class AttributeDelegateBuilder implements Builder {
    constructor(
        private readonly builder: AttributeBuilder,
        private selector?: string,
        private toAttrName?: string,
        private toPropName?: string,
        private isShadow = false
    ) {
        this.toAttrName = this.builder['attrName'];
    }

    static get(builder: AttributeBuilder) {
        return new AttributeDelegateBuilder(builder);
    }

    to(selector: string) {
        this.selector = selector;
        return this
    }

    attribute(toAttrName: string) {
        this.toAttrName = toAttrName;
        this.toPropName = undefined;
        return this;
    }

    property(toPropName: string) {
        this.toAttrName = undefined;
        this.toPropName = toPropName;
        return this;
    }

    shadow() {
        this.isShadow = true;
        return this;
    }

    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        this.builder
            .listener((el, data) => this.delegateValue(el, data.newVal))
            .build(Constructor, hooks);
    }

    private delegateValue(el: HTMLElement, newVal: any) {
        const base = this.isShadow ? el.shadowRoot : el;
        const targets = base.querySelectorAll(this.selector);
        if (targets.length > 0) {
            if (this.toAttrName) {
                if (typeof newVal === 'string') {
                    targets.forEach(t => t.setAttribute(this.toAttrName, newVal));
                } else if (newVal === true) {
                    targets.forEach(t => t.setAttribute(this.toAttrName, ''));
                } else {
                    targets.forEach(t => t.removeAttribute(this.toAttrName));
                }
            } else if (this.toPropName) {
                targets.forEach(t => t[this.toPropName] = newVal);
            }
        }
    }
}

export class PropertyDelegateBuilder implements Builder {
    constructor(
        private propName: string
    ) {
    }

    static get(propName: string) {
        return new PropertyDelegateBuilder(propName);
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

export class MethodDelegateBuilder implements Builder {
    constructor(
        private methName: string
    ) {
    }

    static get(methName: string) {
        return new MethodDelegateBuilder(methName);
    }

    to(selector: string) {
        return this
    }

    build(Constructor: Function, hooks: HooksRegistration) {
    }
}

export class DelegateBuilder {

    static attribute(builder: AttributeBuilder) {
        return AttributeDelegateBuilder.get(builder);
    }

    static property(propName: string) {
        return PropertyDelegateBuilder.get(propName);
    }

    static method(methName: string) {
        return MethodDelegateBuilder.get(methName);
    }

}
