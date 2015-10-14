import {camelCase, isFunction, isUndefined, result, isNull, assign} from '../utils.js';
import {PropertyBuilder} from './PropertyBuilder.js';

/**
 * Get the value from an attribute.
 * @param {!HTMLElement} el an HTML element
 * @param {!string} attrName the name of the attribute
 * @param {!boolean} isBoolean true is the returned value should be a boolean
 * @returns {string|boolean}
 */
export function getAttValue(el, attrName, isBoolean) {
    if (isBoolean) {
        return el.hasAttribute(attrName);
    }
    return el.getAttribute(attrName);
}

/**
 * Set the value of an attribute.
 * @param {!HTMLElement} el an HTML element
 * @param {!string} attrName the name of the attribute
 * @param {!boolean} isBoolean true is the value should be a boolean
 * @param {string|boolean} value the value to set
 */
export function setAttValue(el, attrName, isBoolean, value) {
    if (isBoolean) {
        // Handle boolean value
        if (value && !el.hasAttribute(attrName)) {
            el.setAttribute(attrName, '');
        } else if (!value && el.hasAttribute(attrName)) {
            el.removeAttribute(attrName);
        }
    } else {
        // Handle none boolean value
        if ((isUndefined(value) || isNull(value)) && el.hasAttribute(attrName)) {
            // There is no value, so the attribute must be removed
            el.removeAttribute(attrName);
        } else if (!isUndefined(value) && !isNull(value) && el.getAttribute(attrName) !== value) {
            // Sync the attribute value with value
            el.setAttribute(attrName, value);
        }
    }
}

function getterFactory(attrName, isBoolean) {
    return function () {
        return getAttValue(this, attrName, isBoolean);
    };
}

function setterFactory(attrName, isBoolean, attSetter) {
    return function (value) {
        var attValue = isFunction(attSetter) ? attSetter.call(this, this, value) : value;
        return setAttValue(this, attrName, isBoolean, attValue);
    };
}

/**
 * The attribute builder.
 * Its goal is to provide a way to define an attribute.
 * @extends {PropertyBuilder}
 */
export class AttributeBuilder extends PropertyBuilder {

    /**
     * @param {!string} attrName the name of the attribute
     */
    constructor(attrName) {
        super(camelCase(attrName));
        /**
         * @ignore
         */
        assign(this.data, {
            attrName,
            listeners: [],
            getterFactory,
            setterFactory,
            descriptorValue: false,
            getAttValue: getAttValue,
            setAttValue: setAttValue
        });
    }

    /**
     * To handle the attribute/property value as a boolean:
     * Attribute is present when true and missing when false.
     * @returns {AttributeBuilder} the builder
     */
    boolean() {
        this.data.boolean = true;
        return this;
    }

    /**
     * To override the property name.
     * @param {!string} propName the property name
     * @returns {AttributeBuilder} the builder
     */
    property(propName) {
        this.data.propName = propName;
        return this;
    }

    /**
     * To be notified when the attribute is updated.
     * @param {function(el: HTMLElement, oldVal: string, newVal: string)} listener the listener function
     * @returns {AttributeBuilder} the builder
     */
    listen(listener) {
        this.data.listeners.push(listener);
        return this;
    }

    /**
     * @override
     */
    build(proto, on) {
        let defaultValue = result(this.data, 'value'),
            descriptor = {
                enumerable: this.data.enumerable,
                configurable: false,
                get: this.data.getterFactory(this.data.attrName, this.data.boolean),
                set: this.data.setterFactory(this.data.attrName, this.data.boolean)
            };

        Object.defineProperty(proto, this.data.propName, descriptor);

        on('after:createdCallback').invoke(el => {
            let attrValue = getAttValue(el, this.data.attrName, this.data.boolean);
            if (this.data.boolean) {
                el[this.data.propName] = !!defaultValue ? defaultValue : attrValue;
            } else if (!isNull(attrValue) && !isUndefined(attrValue)) {
                el[this.data.propName] = attrValue;
            } else if (!isUndefined(defaultValue)) {
                el[this.data.propName] = defaultValue;
            }

            if (this.data.listeners.length > 0) {
                let oldValue = this.data.boolean ? false : null;
                let setValue = el[this.data.propName];
                if (oldValue !== setValue) {
                    this.data.listeners.forEach(listener => listener.call(el, el, oldValue, setValue));
                }
            }
        });

        on('before:attributeChangedCallback').invoke((el, attName, oldVal, newVal) => {
            // Synchronize the attribute value with its properties
            if (attName === this.data.attrName) {
                let newValue = this.data.boolean ? newVal === '' : newVal;
                if (el[this.data.propName] !== newValue) {
                    el[this.data.propName] = newValue;
                }
                if (this.data.listeners.length > 0) {
                    let oldValue = this.data.boolean ? oldVal === '' : oldVal;
                    let setValue = this.data.boolean ? newVal === '' : newVal;
                    if (oldValue !== setValue) {
                        this.data.listeners.forEach(listener => listener.call(el, el, oldValue, setValue));
                    }
                }
            }
        });
    }

}
