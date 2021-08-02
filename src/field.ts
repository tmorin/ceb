import {toCamelCase, toKebabCase} from './utilities'
import {Builder, CustomElementConstructor} from './builder'
import {HooksRegistration} from './hook'
import {ElementBuilder} from './element'

/**
 * The data of provided by a {@link FieldListener}.
 */
export type FieldListenerData = {
    /**
     * The property name.
     */
    propName: string
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
 * The field listener is invoked for each observed mutation of the field value.
 */
export interface FieldListener<E extends HTMLElement> {
    /**
     * @param el the custom element
     * @param data the data which describes the mutation
     * @template E the type of the Custom Element
     */
    (el: E, data: FieldListenerData): void
}

/**
 * The builder binds a property to an attribute.
 * So that, the value is available and mutable from both sides.
 *
 * Because of the binding with an attribute, the type of the property has to be either a `string` or a `boolean`.
 * That means, the kind of the field can be _String_ or _Boolean_.
 * The default kind of a field is _String_, the switch to _Boolean_ has to be done explicitly with {@link FieldBuilder.boolean}.
 *
 * By default, the name of the attribute is the the kebab case (`KebabCase_notation` => `kebab-case-notation`) of the property name.
 * However, the attribute name can be overridden with {@link FieldBuilder.attribute}.
 *
 * The listeners of the field values are simple callback functions, c.f. {@link FieldListener}.
 * They can be registered with {@link FieldBuilder.listener}.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link FieldBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class FieldBuilder<E extends HTMLElement = HTMLElement> implements Builder<E> {

    private constructor(
        private _propName?: string,
        private _attrName?: string,
        private _isBoolean = false,
        private _listeners: Array<FieldListener<E>> = []
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param propName the property name, it's optional only when the decorator API (i.e. {@link FieldBuilder.decorate} or {@link FieldBuilder.decorate}) is used
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(propName?: string) {
        return new FieldBuilder<E>(propName, propName && toKebabCase(propName))
    }

    /**
     * Override the default attribute name.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, FieldBuilder} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     name = "World"
     *     connectedCallback() {
     *         this.textContent = `Hello, ${this.name}!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     FieldBuilder.get("name").attribute("alt-name")
     * ).register()
     * ```
     *
     * @param attrName the attribute name
     */
    attribute(attrName: string) {
        this._attrName = attrName
        return this
    }

    /**
     * Override the kind of the field.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, FieldBuilder} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     show = true
     *     connectedCallback() {
     *         this.textContent = `Hello, ${this.show ? "World" : "<i>hidden</i>"}!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     FieldBuilder.get("show").boolean()
     * ).register()
     * ```
     */
    boolean() {
        this._isBoolean = true
        return this
    }

    /**
     * Register a listener which will be invoked when the field value mutate.
     *
     * A listener is callback function ({@link FieldListener}) which have two arguments:
     * 1. the custom element
     * 2. the data describing the mutation c.f. {@link FieldListenerData}
     *
     * @example
     * ```typescript
     * import {ElementBuilder, FieldBuilder} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     name = "World"
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     FieldBuilder.get("name")
     *         .listener((el, data) =>
     *             el.textContent = `Hello, ${data.newVal}!`)
     * ).register()
     * ```
     *
     * @param listener the listener
     */
    listener(listener: FieldListener<E>) {
        this._listeners.push(listener)
        return this
    }


    /**
     * Decorates the property of the field.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, FieldBuilder} from "ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @FieldBuilder.get().boolean().decorate()
     *     show = true
     *     connectedCallback() {
     *         this.textContent = `Hello, ${this.show ? "World" : "<i>hidden</i>"}!`
     *     }
     * }
     * ```
     */
    decorate(): PropertyDecorator

    /**
     * Decorates the listener method which is invoked each time the field value mutate.
     *
     * When the property name is not specified (i.e. `@FieldBuilder.get()`), then it's discovered from the decorated method name.
     * The pattern is `<prefix><PropertyNameInCamelCase>`, where `<prefix>` is by default `on`.
     *
     * @example Discovery of the property name
     * ```typescript
     * import {ElementBuilder, FieldBuilder} from "ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @FieldBuilder.get().decorate()
     *     value = "World"
     *     @FieldBuilder.get().decorate()
     *     onValue(data) {
     *         this.textContent = `Hello, ${this.value}!`
     *     }
     * }
     * ```
     *
     * @example Discovery of the property name with a custom prefix
     * ```typescript
     * import {ElementBuilder, FieldBuilder} from "ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @FieldBuilder.get().decorate()
     *     value = "World"
     *     @FieldBuilder.get().decorate("listen")
     *     listenValue(data) {
     *         this.textContent = `Hello, ${this.value}!`
     *     }
     * }
     * ```
     *
     * @example Skip the property name discovery
     * ```typescript
     * import {ElementBuilder, FieldBuilder} from "ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @FieldBuilder.get().decorate()
     *     value = "World"
     *     @FieldBuilder.get("value").decorate()
     *     listen(data) {
     *         this.textContent = `Hello, ${this.value}!`
     *     }
     * }
     * ```
     *
     * @param prefix the prefix used to discover the property name from the method name
     */
    decorate(prefix?: string): MethodDecorator

    decorate(prefix?: string): PropertyDecorator | MethodDecorator {
        return (target: Object, propOrMethName: string | symbol, methDescriptor?: PropertyDescriptor): void => {
            if (methDescriptor) {
                this.decorateMeth(target, propOrMethName.toString(), methDescriptor, prefix)
            } else {
                this.decorateProp(target, propOrMethName.toString())
            }
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E>) {
        if (!this._propName) {
            throw new TypeError("FieldBuilder - the property name is missing")
        }
        if (!this._attrName) {
            throw new TypeError("FieldBuilder - the attribute name is missing")
        }

        const _propName : string = this._propName
        const _attrName : string = this._attrName

        const defaultValuePropName = '__ceb_field_default_value_' + this._propName

        // registers the attribute to observe
        // @ts-ignore
        if (Constructor['observedAttributes'].indexOf(_attrName) < 0) {
            // @ts-ignore
            Constructor['observedAttributes'].push(_attrName)
        }

        // registers mutation observer
        hooks.before('constructorCallback', el => {
            const builder = this

            // get the initial descriptor if existing to get the default value
            const initialDescriptor = Object.getOwnPropertyDescriptor(el, _propName)

            // creates or overrides the property to intercept both getter and setter
            Object.defineProperty(el, _propName, {
                get(): any {
                    // get the value from the bound attribute
                    return builder._isBoolean ? el.hasAttribute(_attrName) : el.getAttribute(_attrName)
                },
                set(value: any): void {
                    // updates the bound attribute
                    if (value === false || value === undefined || value === null) {
                        el.removeAttribute(_attrName)
                    } else {
                        el.setAttribute(_attrName, builder._isBoolean ? '' : value)
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
            if (!el.hasAttribute(_attrName) && defaultValueDescriptor) {
                const defaultValue = defaultValueDescriptor.value
                if (defaultValue !== undefined && defaultValue !== false) {
                    el.setAttribute(_attrName, this._isBoolean ? '' : defaultValue)
                }
            }
            // the default value shouldn't be set if the element is then moved into the DOM
            // @ts-ignore
            delete el[defaultValuePropName]
        })

        // reacts on attribute values
        hooks.before('attributeChangedCallback', (el, attrName, attrOldVal, attrNewVal) => {
            // manages only expected attribute name
            if (attrName === _attrName) {
                const propName = this._propName
                const oldVal = this._isBoolean ? attrOldVal === '' : attrOldVal
                const newVal = this._isBoolean ? attrNewVal === '' : attrNewVal

                // @ts-ignore
                if (el[propName] !== newVal) {
                    // updates the property only if needed
                    // @ts-ignore
                    el[propName] = newVal
                } else if (oldVal !== newVal) {
                    // executes listeners because value has been updated
                    if (this._listeners.length > 0) {
                        this._listeners.forEach(listener => listener(el, {
                            // @ts-ignore
                            propName,
                            attrName,
                            oldVal,
                            newVal
                        }))
                    }
                }
            }
        })
    }

    private decorateProp(target: Object, propName: string) {
        if (!this._propName) {
            this._propName = propName
        }
        if (!this._attrName) {
            this._attrName = toKebabCase(this._propName)
        }
        const id = `field-${this._propName}`
        const builder = ElementBuilder.getOrSet(target, id, this)
        if (builder !== this) {
            builder.mergeBuilder(this, true)
        }
    }

    private decorateMeth(target: Object, methName: string, descriptor: PropertyDescriptor, prefix = "on") {
        if (!this._propName) {
            this._propName = toCamelCase(
                toKebabCase(methName.replace(prefix, ''))
            )
        }
        const id = `field-${this._propName}`
        const builder = ElementBuilder.getOrSet(target, id, this)
        if (builder !== this) {
            builder.mergeBuilder(this, false)
        }
        builder.listener((el, data) => {
            const fn = descriptor.value as Function
            fn.call(el, data)
        })
    }

    private mergeBuilder(builder: FieldBuilder<E>, isMaster: boolean) {
        if (isMaster) {
            if (!this._attrName) {
                this._attrName = builder._attrName
            }
            if (!this._propName) {
                this._propName = builder._propName
            }
            if (!this._isBoolean) {
                this._isBoolean = builder._isBoolean
            }
            if (builder._listeners) {
                builder._listeners.forEach(listener => this._listeners.push(listener))
            }
        } else {
            if (this._listeners) {
                this._listeners.forEach(listener => builder._listeners.push(listener))
            }
        }
    }

}
