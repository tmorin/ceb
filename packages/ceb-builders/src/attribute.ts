import {Builder, CustomElementConstructor, ElementBuilder, HooksRegistration} from '@tmorin/ceb-core'
import {toCamelCase, toKebabCase} from "@tmorin/ceb-utilities";

/**
 * The data of provided by an {@link AttributeListener}.
 */
export type AttributeListenerData = {
    /**
     * The attribute name.
     */
    attrName: string
    /**
     * The old value.
     */
    oldVal: any
    /**
     * The new value.
     */
    newVal: any
}

/**
 * The attribute listener is invoked for each observed mutation of the attribute value.
 * @template E the type of the Custom Element
 */
export interface AttributeListener<E extends HTMLElement> {
    /**
     * @param el the Custom Element
     * @param data the data which describes the mutation
     */
    (el: E, data: AttributeListenerData): void
}

/**
 * The builder handles the initialization of an attribute as well as the registration of its listeners.
 *
 * The default value of the attribute can be provided using {@link AttributeBuilder.default}.
 *
 * The kind of the attribute can be _String_ or _Boolean_.
 * The default kind of an attribute is _String_, the switch to _Boolean_ can be done explicitly with {@link AttributeBuilder.boolean}
 * or implicitly when a default value (`true` or `false`) is provided with {@link AttributeBuilder.default}.
 *
 * According the kind of the attribute, the creation of the attribute in the DOM differs.
 * About the kind _Boolean_, when the value is `true` then the attribute DOM node is added and set with an empty string
 * otherwise, nothing occurs.
 * About the kind _String_, when the value is not `undefined` and not `null` then the attribute DOM node is added and
 * set with the value otherwise, nothing occurs.
 *
 * The listeners of the attribute values are simple callback functions, c.f. {@link AttributeListener}.
 * They can be registered with {@link AttributeBuilder.listener}.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link AttributeBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class AttributeBuilder<E extends HTMLElement = HTMLElement> implements Builder<E> {

    private constructor(
        private _attrName?: string,
        private _defaultValue?: boolean | string,
        private _isBoolean = false,
        private _listeners: Array<AttributeListener<E>> = []
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param attrName the attribute name, it's optional only when the decorator API (i.e. {@link AttributeBuilder.decorate}) is used
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(attrName?: string) {
        return new AttributeBuilder<E>(attrName && toKebabCase(attrName))
    }

    /**
     * Override the kind of the attribute.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, AttributeBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.textContent = `Hello, World!`
     *         if (this.hasAttribute("br")) {
     *             this.appendChild(document.createElement("br"))
     *         }
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     AttributeBuilder.get("br").boolean().default(true)
     * ).register()
     * ```
     */
    boolean() {
        this._isBoolean = true
        return this
    }

    /**
     * Set the default value of the attribute.
     *
     * If the value is a `boolean`, then the kind of the attribute value is set to `boolean` too.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, AttributeBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.textContent = `Hello, ${this.getAttribute("name")}!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     AttributeBuilder.get("name").default("World")
     * ).register()
     * ```
     *
     * @param value the default value
     */
    default(value: string | boolean) {
        this._defaultValue = value
        if (typeof value !== "undefined" && value !== null) {
            this._isBoolean = typeof value === "boolean"
        }
        return this
    }

    /**
     * Register a listener which will be invoked when the attribute value mutate.
     *
     * A listener is callback function ({@link AttributeListener}) which have two arguments:
     * 1. the custom element
     * 2. the data describing the mutation c.f. {@link AttributeListenerData}
     *
     * @example
     * ```typescript
     * import {ElementBuilder, AttributeBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     AttributeBuilder.get("name")
     *         .default("World")
     *         .listener((el, data) =>
     *             el.textContent = `Hello, ${data.newVal}!`)
     * ).register()
     * ```
     *
     * @param listener the listener
     */
    listener(listener: AttributeListener<E>) {
        this._listeners.push(listener)
        return this
    }

    /**
     * Decorates the listener method which is invoked each time the attribute value mutate.
     *
     * When the attribute name is not specified (i.e. `@AttributeBuilder.get()`), then it's discovered from the decorated method name.
     * The pattern is `<prefix><AttributeNameInCamelCase>`, where `<prefix>` is by default `on`.
     *
     * @example Discovery of the attribute name
     * ```typescript
     * import {ElementBuilder, AttributeBuilder} from "@tmorin\ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @AttributeBuilder.get().decorate()
     *     onValue(data) {
     *         // ...
     *     }
     * }
     * ```
     *
     * @example Discovery of the attribute name with a custom prefix
     * ```typescript
     * import {ElementBuilder, AttributeBuilder} from "@tmorin\ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @AttributeBuilder.get().decorate("listen")
     *     listenDataValue(data) {
     *         // ...
     *     }
     * }
     * ```
     *
     * @example Skip the attribute name discovery
     * ```typescript
     * import {ElementBuilder, AttributeBuilder} from "@tmorin\ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @AttributeBuilder.get("foo-bar").decorate()
     *     listen(data) {
     *         // ...
     *     }
     * }
     * ```
     *
     * @param prefix the prefix used to discover the attribute name from the method name
     */
    decorate(prefix = "on"): MethodDecorator {
        return (target: Object, methName: string | symbol, descriptor: PropertyDescriptor) => {
            if (!this._attrName) {
                this._attrName = toKebabCase(
                    methName.toString().replace(prefix, '')
                )
            }
            this.listener((el, data) => {
                const fn = descriptor.value as Function
                fn.call(el, data)
            })
            ElementBuilder.getOrSet(target, this, `attribute-${this._attrName}`)
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E & { [key: string]: any }>) {
        if (!this._attrName) {
            throw new TypeError("AttributeBuilder - the attribute name is missing")
        }
        const _attrName = this._attrName
        const _defaultValuePropName = '__ceb_attribute_default_value_' + toCamelCase(_attrName)

        // registers the attribute to observe
        // @ts-ignore
        if (Constructor['observedAttributes'].indexOf(this._attrName) < 0) {
            // @ts-ignore
            Constructor['observedAttributes'].push(this._attrName)
        }

        // set the default value
        hooks.after('connectedCallback', el => {
            if (!el[_defaultValuePropName]
                && !el.hasAttribute(_attrName)
                && this._defaultValue !== undefined
                && this._defaultValue !== false
                && this._defaultValue !== null
            ) {
                Object.defineProperty(el, _defaultValuePropName, {
                    value: true,
                    writable: false,
                    configurable: false,
                    enumerable: false
                })
                el.setAttribute(_attrName, this._isBoolean ? '' : this._defaultValue as string)
            }
        })

        // reacts on attribute values
        hooks.before('attributeChangedCallback', (el, attrName, oldValue, newValue) => {
            // invokes listeners
            if (attrName === _attrName) {
                if (this._listeners.length > 0) {
                    const oldVal = this._isBoolean ? oldValue === '' : oldValue
                    const newVal = this._isBoolean ? newValue === '' : newValue
                    if (oldValue !== newValue) {
                        this._listeners.forEach(listener => listener(el, {attrName, oldVal, newVal}))
                    }
                }
            }
        })
    }

}
