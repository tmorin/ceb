import {toCamelCase, toKebabCase} from './utilities'
import {Builder, CustomElementConstructor} from './builder'
import {HooksRegistration} from './hook'
import {ElementBuilder} from './element'

/**
 * The data of the field listener.
 */
export interface FieldListenerData {
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
 * The field listener.
 */
export interface FieldListener {
    /**
     * @param el the custom element
     * @param data the data
     */
    (el: HTMLElement, data: FieldListenerData): void
}

/**
 * The options of the decorator: `FieldBuilder.field()`.
 */
export interface FieldDecoratorOptions {
    /**
     * To override the name of the attribute.
     */
    attrName?: string
    /**
     * When the value is truthy, the attribute's value is "".
     * When the value is falsy, the attribute is removed.
     */
    boolean?: boolean
}

/**
 * The options of the decorator: `FieldBuilder.listen()`.
 */
export interface ListenerFieldDecoratorOptions {
    /**
     * To specify the name of the property.
     */
    propName?: string
    /**
     * The prefix to strip  to get the field name.
     * By default, the prefix is `on`.
     */
    prefix?: string
}

function getPrefix(value: string) {
    return value ? value : 'on'
}

/**
 * The field builder provides services to define fields.
 * A field is an attribute bound to a property.
 * The value is hosted by the attribute but it can be mutated using the bound property.
 */
export class FieldBuilder implements Builder {

    constructor(
        private propName: string,
        private attrName: string,
        private isBoolean = false,
        private listeners: Array<FieldListener> = []
    ) {
    }

    /**
     * Property Decorator used to bind a property to an attribute.
     * @param options the options
     */
    static field(options: FieldDecoratorOptions = {}) {
        return function (target: HTMLElement, propName: string) {
            const id = `field-${propName}`
            const builder = ElementBuilder.getOrSet(target, id, FieldBuilder.get(propName))
            if (options.boolean) {
                builder.boolean()
            }
            if (options.attrName) {
                builder.attribute(options.attrName)
            }
        }
    }

    /**
     * Method Decorator used to register a listener listening to field changes.
     * @param options the options
     */
    static listen(options: ListenerFieldDecoratorOptions = {}) {
        return function (target: any, methName: string, descriptor: PropertyDescriptor) {
            const prefix = getPrefix(options.prefix)
            const propName = options.propName || toCamelCase(toKebabCase(methName.replace(prefix, '')))
            const id = `field-${propName}`
            ElementBuilder.getOrSet(target, id, FieldBuilder.get(propName)).listener((el, data) => {
                const fn = descriptor.value as Function
                fn.call(el, data)
            })
        }
    }

    /**
     * Provide a fresh builder.
     * @param propName the property name
     */
    static get(propName: string) {
        const attrName = toKebabCase(propName)
        return new FieldBuilder(propName, attrName)
    }

    /**
     * Override the default attribute name.
     * @param attrName the attribute name
     */
    attribute(attrName: string) {
        this.attrName = attrName
        return this
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
     * Register a listener which will be invoked when the attribute's value changed.
     * @param listener the listener
     */
    listener(listener: FieldListener) {
        this.listeners.push(listener)
        return this
    }

    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        const defaultValuePropName = '__cebFieldDefaultValue_' + this.propName

        // registers the attribute to observe
        Constructor['observedAttributes'].push(this.attrName)

        // registers mutation observer
        hooks.before('constructorCallback', el => {
            const builder = this

            // get the initial descriptor if existing to get the default value
            const initialDescriptor = Object.getOwnPropertyDescriptor(el, this.propName)

            // creates or overrides the property to intercept both getter and setter
            Object.defineProperty(el, this.propName, {
                get(): any {
                    // get the value from the bound attribute
                    return builder.isBoolean ? el.hasAttribute(builder.attrName) : el.getAttribute(builder.attrName)
                },
                set(value: any): void {
                    // updates the bound attribute
                    if (value === false || value === undefined || value === null) {
                        el.removeAttribute(builder.attrName)
                    } else {
                        el.setAttribute(builder.attrName, builder.isBoolean ? '' : value)
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
            if (!el.hasAttribute(this.attrName) && defaultValueDescriptor) {
                const defaultValue = defaultValueDescriptor.value
                if (defaultValue !== undefined && defaultValue !== false) {
                    el.setAttribute(this.attrName, this.isBoolean ? '' : defaultValue)
                }
            }
            // the default value shouldn't be set if the element is then moved into the DOM
            delete el[defaultValuePropName]
        })

        // reacts on attribute values
        hooks.before('attributeChangedCallback', (el, attrName, attrOldVal, attrNewVal) => {
            // manages only expected attribute name
            if (attrName === this.attrName) {
                const propName = this.propName
                const oldVal = this.isBoolean ? attrOldVal === '' : attrOldVal
                const newVal = this.isBoolean ? attrNewVal === '' : attrNewVal

                if (el[propName] !== newVal) {
                    // updates the property only if needed
                    el[propName] = newVal
                } else if (oldVal !== newVal) {
                    // executes listeners because value has been updated
                    if (this.listeners.length > 0) {
                        this.listeners.forEach(listener => listener(el, {
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

}
