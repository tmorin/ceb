import {toCamelCase, toKebabCase} from './utilities';
import {Builder, CustomElementConstructor} from './builder';
import {HooksRegistration} from './hook';

export interface AttributeListenerData {
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

export interface AttributeListener {
    /**
     * @param el the custom element
     * @param data the data
     */
    (el: HTMLElement, data: AttributeListenerData): void
}

/**
 * The attribute builder provides services to initialize an attribute and react on changes.
 */
export class AttributeBuilder implements Builder {

    constructor(
        private attrName: string,
        private defaultValue: boolean | string = undefined,
        private isBoolean = false,
        private listeners: Array<AttributeListener> = []
    ) {
    }

    /**
     * Provides a fresh build.
     * @param attrName the attribute name
     */
    static get(attrName: string) {
        return new AttributeBuilder(toKebabCase(attrName));
    }

    /**
     * When the value is truthy, the attribute's value is "".
     * When the value is falsy, the attribute is removed.
     */
    boolean() {
        this.isBoolean = true;
        return this;
    }

    /**
     * Set a default value when the attribute is unbound.
     * @param value the default value
     */
    default(value: string | boolean) {
        this.defaultValue = value;
        return this;
    }

    /**
     * Register a listener which will be invoked when the attribute's value changed.
     * @param listener the listener
     */
    listener(listener: AttributeListener) {
        this.listeners.push(listener);
        return this;
    }

    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        const defaultValuePropName = '__cebAttributeDefaultValue_' + toCamelCase(this.attrName);

        // registers the attribute to observe
        Constructor['observedAttributes'].push(this.attrName);

        // set the default value
        hooks.after('connectedCallback', el => {
            if (!el[defaultValuePropName]
                && !el.hasAttribute(this.attrName)
                && this.defaultValue !== undefined
                && this.defaultValue !== false
                && this.defaultValue !== null
            ) {
                el[defaultValuePropName] = true;
                el.setAttribute(this.attrName, this.isBoolean ? '' : this.defaultValue as string);
            }
        });

        // reacts on attribute values
        hooks.before('attributeChangedCallback', (el, attrName, oldValue, newValue) => {
            // invokes listeners
            if (attrName === this.attrName) {
                if (this.listeners.length > 0) {
                    const oldVal = this.isBoolean ? oldValue === '' : oldValue;
                    const newVal = this.isBoolean ? newValue === '' : newValue;
                    if (oldValue !== newValue) {
                        this.listeners.forEach(listener => listener(el, {attrName, oldVal, newVal}));
                    }
                }
            }
        });
    }

}
