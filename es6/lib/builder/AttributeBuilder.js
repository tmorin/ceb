import camelCase from 'lodash/string/camelCase.js';
import isFunction from 'lodash/lang/isFunction.js';
import isUndefined from 'lodash/lang/isUndefined.js';
import isNull from 'lodash/lang/isNull.js';
import assign from 'lodash/object/assign.js';

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
        //let value = el.getAttribute(attrName);
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
    return (el) => {
        return getAttValue(el, attrName, isBoolean);
    };
}

function setterFactory(attrName, isBoolean, attSetter) {
    return (el, value) => {
        var attValue = isFunction(attSetter) ? attSetter.call(el, el, value) : value;
        return setAttValue(el, attrName, isBoolean, attValue);
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
     * @returns {AttributeBuilder}
     */
    property(propName) {
        this.data.propName = propName;
        return this;
    }

    /**
     * @override
     */
    build(proto, on) {
        let attGetter = this.data.getter,
            attSetter = this.data.setter;

        this.data.getter = this.data.getterFactory(this.data.attrName, this.data.boolean, attGetter);
        this.data.setter = this.data.setterFactory(this.data.attrName, this.data.boolean, attSetter);

        if (this.data.boolean) {
            delete this.data.value;
        }

        super.build(proto, on);

        on('before:createdCallback').invoke(el => {
            let attrValue = getAttValue(el, this.data.attrName, this.data.boolean);
            if (!isNull(attrValue) && !isUndefined(attrValue)) {
                this.data.value = attrValue;
            }
        });

        on('before:attributeChangedCallback').invoke((el, attName, oldVal, newVal) => {
            // Synchronize the attribute value with its properties
            if (attName === this.data.attrName) {
                let value = this.data.boolean ? newVal === '' : newVal;
                if (el[this.data.propName] !== value) {
                    el[this.data.propName] = value;
                }
            }
        });
    }

}

/**
 * @ignore
 */
export default function helper(attName) {
    return new AttributeBuilder(attName);
}

