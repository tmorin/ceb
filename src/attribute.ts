import {toCamelCase, toKebabCase} from './utilities'
import {Builder, CustomElementConstructor} from './builder'
import {HooksRegistration} from './hook'
import {ElementBuilder} from './element'

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
 * The attribute listener.
 */
export interface AttributeListener {
    /**
     * @param el the custom element
     * @param data the data
     */
    (el: HTMLElement, data: AttributeListenerData): void
}

/**
 * The options of the decorator {@link AttributeBuilder.listen}.
 */
export type ListenerAttributeDecoratorOptions = {
    /**
     * The attribute name.
     */
    attrName?: string
    /**
     * The prefix to strip  to get the attribute name.
     * If `true`, the prefix will be `on`.
     */
    prefix?: boolean | string
    /**
     * When the value is truthy, the attribute's value is "" otherwise the attribute is removed.
     */
    isBoolean?: boolean
}

function getPrefix(prefix?: boolean | string): string {
    if (typeof prefix === 'string') {
        return prefix
    }
    return prefix === false ? '' : 'on'
}

/**
 * The builder provides services to initialize an attribute and react on changes.
 *
 * @example With the builder API - Define the attribute `value` and react on changes
 * ```typescript
 * import {ElementBuilder, AttributeBuilder} from "ceb"
 * class HelloWorld extends HTMLElement {
 * }
 * ElementBuilder.get().builder(
 *     AttributeBuilder.get("value").default("World").listener(
 *         (el, data) => el.textContent = `Hello, ${data.newVal}!`
 *     )
 * ).register()
 * ```
 *
 * @example With the decorator API - Define the attribute `value` and react on changes
 * ```typescript
 * import {ElementBuilder, AttributeBuilder} from "ceb"
 * @ElementBuilder.element()
 * class HelloWorld extends HTMLElement {
 *     @AttributeBuilder.listen()
 *     onValue(data) {
 *         this.textContent = `Hello, ${data.newVal}!`
 *     }
 * }
 * ```
 */
export class AttributeBuilder implements Builder {

    private constructor(
        private attrName: string,
        private defaultValue: boolean | string = undefined,
        private isBoolean = false,
        private listeners: Array<AttributeListener> = []
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param attrName the attribute name
     */
    static get(attrName: string) {
        return new AttributeBuilder(toKebabCase(attrName))
    }

    /**
     * Method Decorator used to register a listener listening to attribute changes.
     * @param options the options
     */
    static listen(options: ListenerAttributeDecoratorOptions = {}) {
        return function (target: any, methName: string, descriptor: PropertyDescriptor) {
            const prefix = getPrefix(options.prefix)
            const attrName = options.attrName || toKebabCase(methName.replace(prefix, ''))
            const id = `attribute-${attrName}`
            const builder = ElementBuilder.getOrSet(target, id, AttributeBuilder.get(attrName)).listener((el, data) => {
                const fn = descriptor.value as Function
                fn.call(el, data)
            })
            if (options.isBoolean) {
                builder.boolean()
            }
        }
    }

    /**
     * When the value is truthy, the attribute's value is "".
     * When the value is falsy, the attribute is removed.
     */
    boolean() {
        this.isBoolean = true
        return this
    }

    /**
     * Set a default value when the attribute is unbound.
     * @param value the default value
     */
    default(value: string | boolean) {
        this.defaultValue = value
        return this
    }

    /**
     * Register a listener which will be invoked when the attribute's value changed.
     * @param listener the listener
     */
    listener(listener: AttributeListener) {
        this.listeners.push(listener)
        return this
    }

    /**
     * The is API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        const defaultValuePropName = '__ceb_attribute_default_value_' + toCamelCase(this.attrName)

        // registers the attribute to observe
        Constructor['observedAttributes'].push(this.attrName)

        // set the default value
        hooks.after('connectedCallback', el => {
            if (!el[defaultValuePropName]
                && !el.hasAttribute(this.attrName)
                && this.defaultValue !== undefined
                && this.defaultValue !== false
                && this.defaultValue !== null
            ) {
                el[defaultValuePropName] = true
                el.setAttribute(this.attrName, this.isBoolean ? '' : this.defaultValue as string)
            }
        })

        // reacts on attribute values
        hooks.before('attributeChangedCallback', (el, attrName, oldValue, newValue) => {
            // invokes listeners
            if (attrName === this.attrName) {
                if (this.listeners.length > 0) {
                    const oldVal = this.isBoolean ? oldValue === '' : oldValue
                    const newVal = this.isBoolean ? newValue === '' : newValue
                    if (oldValue !== newValue) {
                        this.listeners.forEach(listener => listener(el, {attrName, oldVal, newVal}))
                    }
                }
            }
        })
    }

}
