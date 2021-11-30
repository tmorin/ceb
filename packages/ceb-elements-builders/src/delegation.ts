import {Builder, CustomElementConstructor, ElementBuilder, HooksRegistration} from "@tmorin/ceb-elements-core";

/**
 * The builder delegates the accesses of a property to an embedded element.
 *
 * The CSS selector which targets the embedded element is handled with {@link PropertyDelegationBuilder.to}.
 *
 * By default, the propagation selects an element in the Light DOM.
 * Nevertheless, the selection can done into the Shadow DOM with {@link PropertyDelegationBuilder.shadow}.
 *
 * By default, the accesses are delegated to the target's property which matches the same name.
 * However, the targeted property name can be changed with {@link PropertyDelegationBuilder.property}.
 *
 * Moreover, instead of delegating to a property, the accesses can be delegated to an attribute using {@link PropertyDelegationBuilder.attribute}.
 * In that case, the value can only be a `string` or a `boolean`.
 * If the value is a `boolean`, then it has to be expressed with {@link PropertyDelegationBuilder.boolean}
 *
 * Both {@link PropertyDelegationBuilder.attribute} and {@link PropertyDelegationBuilder.property} are exclusive.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link PropertyDelegationBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class PropertyDelegationBuilder<E extends HTMLElement = HTMLElement> implements Builder<E> {
    private constructor(
        private _propName?: string,
        private _selector?: string,
        private _toAttrName?: string,
        private _toPropName?: string,
        private _isShadow = false,
        private _isBoolean = false
    ) {
        this._toPropName = _propName
    }

    /**
     * Provide a fresh builder.
     * @param propName the property name, it's optional only when the decorator API (i.e. {@link PropertyDelegationBuilder.decorate}) is used
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(propName?: string) {
        return new PropertyDelegationBuilder<E>(propName)
    }

    /**
     * Define the select element
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {PropertyDelegationBuilder} from "@tmorin/ceb-elements-builders"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     connectedCallback() {
     *         this.innerHTML = `Hello, <input readonly>!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     PropertyDelegationBuilder.get("value").to("input")
     * ).register()
     * ```
     *
     * @param selector the CSS selector
     */
    to(selector: string) {
        this._selector = selector
        return this
    }

    /**
     * Delegate the access to an attribute.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {PropertyDelegationBuilder} from "@tmorin/ceb-elements-builders"
     * class HelloWorld extends HTMLElement {
     *     name = "World"
     *     connectedCallback() {
     *         this.innerHTML = `Hello, <input readonly>!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     PropertyDelegationBuilder.get("name")
     *         .to("input").attribute("value")
     * ).register()
     * ```
     *
     * @param toAttrName the attribute name.
     */
    attribute(toAttrName: string) {
        this._toAttrName = toAttrName
        this._toPropName = undefined
        return this
    }

    /**
     * Override the property name.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {PropertyDelegationBuilder} from "@tmorin/ceb-elements-builders"
     * class HelloWorld extends HTMLElement {
     *     name = "World"
     *     connectedCallback() {
     *         this.innerHTML = `Hello, <input readonly>!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     PropertyDelegationBuilder.get("name")
     *         .to("input").property("value")
     * ).register()
     * ```
     *
     * @param toPropName the property name.
     */
    property(toPropName: string) {
        this._toAttrName = undefined
        this._toPropName = toPropName
        return this
    }

    /**
     * When targeting an attribute, switch the boolean mode.
     *
     * When the value is truthy, the attribute's value is "".
     * When the value is falsy, the attribute is removed.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {PropertyDelegationBuilder} from "@tmorin/ceb-elements-builders"
     * class HelloWorld extends HTMLElement {
     *     frozen = tue
     *     connectedCallback() {
     *         this.innerHTML = `Hello, <input value="World">!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     PropertyDelegationBuilder.get("frozen")
     *         .to("input").attribute("readonly").boolean()
     * ).register()
     * ```
     */
    boolean() {
        this._isBoolean = true
        return this
    }

    /**
     * By default, the selection of the target element is done in the light DOM.
     * This option forces the selection into the shadow DOM.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {PropertyDelegationBuilder} from "@tmorin/ceb-elements-builders"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     connectedCallback() {
     *         this.attachShadow({mode: "open"})
     *         this.shadowRoot.innerHTML = `Hello, <input readonly>!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     PropertyDelegationBuilder.get("value")
     *         .to("input")
     *         .shadow()
     * ).register()
     * ```
     */
    shadow() {
        this._isShadow = true
        return this
    }

    /**
     * Property decorator used to define a property delegation.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {PropertyDelegationBuilder} from "@tmorin/ceb-elements-builders"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @PropertyDelegationBuilder.get()
     *         .to("span")
     *         .property("textContent")
     *         .decorate()
     *     name = "World"
     *     connectedCallback() {
     *         this.innerHTML = `Hello, <span></span>!`
     *     }
     * }
     * ```
     */
    decorate(): PropertyDecorator {
        return (target: Object, propName: string | symbol) => {
            if (!this._propName) {
                this._propName = propName.toString()
            }
            const id = `delegate-property-${this._propName}`
            ElementBuilder.getOrSet(target, this, id)
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E & { [key: string]: any }>) {
        if (!this._propName) {
            throw new TypeError("PropertyDelegationBuilder - the property name is missing")
        }
        if (!this._selector) {
            throw new TypeError("PropertyDelegationBuilder - the CSS selector is missing")
        }
        const _propName = this._propName
        const _selector = this._selector

        const defaultValuePropName = "__ceb_delegate_property_default_value_" + _propName

        // registers mutation observer
        hooks.before("constructorCallback", (el) => {
            const builder = this
            const base = this._isShadow ? el.shadowRoot : el
            if (!base) {
                throw new Error("PropertyDelegationBuilder - shadow DOM is targeted but no doesn't exist")
            }
            // get the initial descriptor if existing to get the default value
            const initialDescriptor = Object.getOwnPropertyDescriptor(el, _propName)
            // creates or overrides the property to intercept both getter and setter
            Object.defineProperty(el, _propName, {
                get(): any {
                    const target = base.querySelector(_selector) as Element & { [k: string]: any }
                    if (!target) {
                        return
                    }
                    if (builder._toAttrName) {
                        return builder._isBoolean ? target.hasAttribute(builder._toAttrName) : target.getAttribute(builder._toAttrName)
                    }
                    const propName: string = builder._toPropName || _propName
                    return target[propName]
                },
                set(value: any): void {
                    const target = base.querySelector(_selector) as Element & { [k: string]: any }
                    if (!target) {
                        return
                    }
                    if (builder._toAttrName) {
                        if (value === false || value === undefined || value === null) {
                            target.removeAttribute(builder._toAttrName)
                        } else {
                            target.setAttribute(builder._toAttrName, builder._isBoolean ? "" : value)
                        }
                    } else {
                        const propName: string = builder._toPropName || _propName
                        target[propName] = value
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
        hooks.after("connectedCallback", (el) => {
            const defaultValueDescriptor = Object.getOwnPropertyDescriptor(el, defaultValuePropName)
            // applies the default value if its description has been found
            if (defaultValueDescriptor) {
                // @ts-ignore
                el[_propName] = defaultValueDescriptor.value
            }
            // the default value shouldn't be set if the element is then moved into the DOM
            delete el[defaultValuePropName]
        })
    }
}
