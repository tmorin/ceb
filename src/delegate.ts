import {Builder, CustomElementConstructor} from './builder'
import {HooksRegistration} from './hook'
import {AttributeBuilder} from './attribute'
import {ElementBuilder} from './element'

/**
 * The options of the decorator: `AttributeDelegateBuilder.delegate()`.
 */
export interface AttributeDelegateDecoratorOptions {
    /**
     * When the value is truthy, the attribute's value is "" otherwise the attribute is removed.
     */
    isBoolean?: boolean
    /**
     * The default value of the attribute.
     */
    defaultValue?: boolean | string
    /**
     * By default the builder delegates to the same attribute name.
     * This option overrides the default attribute name.
     */
    toAttrName?: string
    /**
     * By default the builder delegates to the same attribute name.
     * This option forces the delegation to a property.
     */
    toPropName?: string
    /**
     * By default, the selection of the element is done in the light DOM.
     * This option force the selection into the shadow DOM.
     */
    isShadow?: boolean
}

/**
 * The AttributeDelegateBuilder delegates the access of an attribute to an embedded element.
 */
export class AttributeDelegateBuilder implements Builder {
    constructor(
        private readonly builder: AttributeBuilder,
        private selector?: string,
        private toAttrName?: string,
        private toPropName?: string,
        private isShadow = false
    ) {
        this.toAttrName = this.builder['attrName']
    }

    /**
     * Provide a fresh builder.
     * @param builder the attribute builder
     */
    static get(builder: AttributeBuilder) {
        return new AttributeDelegateBuilder(builder)
    }

    /**
     * Class decorator used to define an attribute delegator.
     * @param attrName the attribute name
     * @param selector The CSS selector used to identify the DOM element(s).
     * @param options the options
     */
    static delegate<T extends HTMLElement>(attrName: string, selector: string, options: AttributeDelegateDecoratorOptions = {}) {
        return function (constructor: CustomElementConstructor<T>) {
            const attrId = `attribute-${attrName}`
            const deleId = `delegate-attribute-${attrName}`
            const attrBuilder = ElementBuilder.getOrSet(constructor.prototype, attrId, AttributeBuilder.get(attrName))
            const deleBuilder = ElementBuilder.getOrSet(constructor.prototype, deleId, DelegateBuilder.attribute(attrBuilder))
            if (options.isBoolean) {
                attrBuilder.boolean()
            }
            if (options.defaultValue) {
                attrBuilder.default(options.defaultValue)
            }
            deleBuilder.to(selector)
            if (options.isShadow) {
                deleBuilder.shadow()
            }
            if (options.toAttrName) {
                deleBuilder.attribute(options.toAttrName)
            }
            if (options.toPropName) {
                deleBuilder.property(options.toPropName)
            }
        }
    }

    /**
     * The CSS selector used to identify the DOM element(s).
     * @param selector the selector
     */
    to(selector: string) {
        this.selector = selector
        return this
    }

    /**
     * Delegate to an attribute.
     * @param toAttrName the attribute name.
     */
    attribute(toAttrName: string) {
        this.toAttrName = toAttrName
        this.toPropName = undefined
        return this
    }

    /**
     * Delegate to property.
     * @param toPropName the property name.
     */
    property(toPropName: string) {
        this.toAttrName = undefined
        this.toPropName = toPropName
        return this
    }

    /**
     * By default, the selection of the element is done in the light DOM.
     * This option forces the selection into the shadow DOM.
     */
    shadow() {
        this.isShadow = true
        return this
    }

    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        this.builder
            .listener((el, data) => this.delegateValue(el, data.newVal))
            .build(Constructor, hooks)
    }

    private delegateValue(el: HTMLElement, newVal: any) {
        const base = this.isShadow ? el.shadowRoot : el
        const targets = base.querySelectorAll(this.selector)
        if (targets.length > 0) {
            if (this.toAttrName) {
                if (typeof newVal === 'string') {
                    targets.forEach(t => t.setAttribute(this.toAttrName, newVal))
                } else if (newVal === true) {
                    targets.forEach(t => t.setAttribute(this.toAttrName, ''))
                } else {
                    targets.forEach(t => t.removeAttribute(this.toAttrName))
                }
            } else if (this.toPropName) {
                targets.forEach(t => t[this.toPropName] = newVal)
            }
        }
    }
}

/**
 * The options of the decorator: `PropertyDelegateBuilder.delegate()`.
 */
export interface PropertyDelegateDecoratorOptions {
    /**
     * Only used when delegating to an attribute.
     * When the value is truthy, the attribute's value is "" otherwise the attribute is removed.
     */
    isBoolean?: boolean
    /**
     * By default the builder delegates to the same property name.
     * This option forces the delegation to an attribute.
     */
    toAttrName?: string
    /**
     * By default the builder delegates to the same property name.
     * This option overrides the default property name.
     */
    toPropName?: string
    /**
     * By default, the selection of the element is done in the light DOM.
     * This option force the selection into the shadow DOM.
     */
    isShadow?: boolean
}

/**
 * The PropertyDelegateBuilder delegates the access of a property to an embedded element.
 */
export class PropertyDelegateBuilder implements Builder {
    constructor(
        private readonly propName: string,
        private selector?: string,
        private toAttrName?: string,
        private toPropName?: string,
        private isShadow = false,
        private isBoolean = false
    ) {
        this.toPropName = propName
    }

    /**
     * Provide a fresh builder.
     * @param propName the property name
     */
    static get(propName: string) {
        return new PropertyDelegateBuilder(propName)
    }

    /**
     * Property Decorator used to bind a property to an attribute.
     * @param selector the selector
     * @param options the options
     */
    static delegate(selector: string, options: PropertyDelegateDecoratorOptions = {}) {
        return function (target: HTMLElement, propName: string) {
            const id = `delegate-property-${propName}`
            const builder = ElementBuilder.getOrSet(target, id, PropertyDelegateBuilder.get(propName))
            builder.to(selector)
            if (options.isBoolean) {
                builder.boolean()
            }
            if (options.toAttrName) {
                builder.attribute(options.toAttrName)
            }
            if (options.toPropName) {
                builder.property(options.toPropName)
            }
            if (options.isShadow) {
                builder.shadow()
            }
        }
    }

    /**
     * The CSS selector used to identify the DOM element(s).
     * @param selector the selector
     */
    to(selector: string) {
        this.selector = selector
        return this
    }

    /**
     * Delegate to an attribute.
     * @param toAttrName the attribute name.
     */
    attribute(toAttrName: string) {
        this.toAttrName = toAttrName
        this.toPropName = undefined
        return this
    }

    /**
     * Delegate to property.
     * @param toPropName the property name.
     */
    property(toPropName: string) {
        this.toAttrName = undefined
        this.toPropName = toPropName
        return this
    }

    /**
     * Only used when delegating to an attribute.
     * When the value is truthy, the attribute's value is "".
     * When the value is falsy, the attribute is removed.
     */
    boolean() {
        this.isBoolean = true
        return this
    }

    /**
     * By default, the selection of the element is done in the light DOM.
     * This option forces the selection into the shadow DOM.
     */
    shadow() {
        this.isShadow = true
        return this
    }

    build(Constructor: Function, hooks: HooksRegistration) {
        const defaultValuePropName = '__cebDelegatePropertyDefaultValue_' + this.propName
        // registers mutation observer
        hooks.before('constructorCallback', el => {
            const builder = this
            const base = this.isShadow ? el.shadowRoot : el
            // get the initial descriptor if existing to get the default value
            const initialDescriptor = Object.getOwnPropertyDescriptor(el, this.propName)
            // creates or overrides the property to intercept both getter and setter
            Object.defineProperty(el, this.propName, {
                get(): any {
                    const target = base.querySelector(builder.selector)
                    if (builder.toAttrName) {
                        return builder.isBoolean ? target.hasAttribute(builder.toAttrName) : target.getAttribute(builder.toAttrName)
                    }
                    return target[builder.toPropName || builder.propName]
                },
                set(value: any): void {
                    const target = base.querySelector(builder.selector)
                    if (builder.toAttrName) {
                        if (value === false || value === undefined || value === null) {
                            target.removeAttribute(builder.toAttrName)
                        } else {
                            target.setAttribute(builder.toAttrName, builder.isBoolean ? '' : value)
                        }
                    } else {
                        target[builder.toPropName || builder.propName] = value
                    }
                }
            })
            const defaultValue = initialDescriptor && initialDescriptor.value
            if (defaultValue !== undefined && defaultValue !== false) {
                // the default value cannot be set has attribute value as long as the element is not attached
                // so the value is kept into a transient property
                Object.defineProperty(el, defaultValuePropName, {
                    value: defaultValue,
                    enumerable: false,
                    writable: false,
                    configurable: true
                })
            }
        })
        // handles the default value
        hooks.after('connectedCallback', el => {
            const defaultValueDescriptor = Object.getOwnPropertyDescriptor(el, defaultValuePropName)
            // applies the default value if its description has been found
            if (defaultValueDescriptor) {
                el[this.propName] = defaultValueDescriptor.value
            }
            // the default value shouldn't be set if the element is then moved into the DOM
            delete el[defaultValuePropName]
        })
    }
}

/**
 * Facade regrouping builder factories about delegation.
 */
export class DelegateBuilder {

    /**
     * Create a fresh AttributeDelegateBuilder.
     * @param builder the attribute builder
     */
    static attribute(builder: AttributeBuilder) {
        return AttributeDelegateBuilder.get(builder)
    }

    /**
     * Create a fresh PropertyDelegateBuilder.
     * @param propName the property name
     */
    static property(propName: string) {
        return PropertyDelegateBuilder.get(propName)
    }

}
