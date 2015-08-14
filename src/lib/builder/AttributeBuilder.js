import camelCase from 'lodash/string/camelCase';
import isFunction from 'lodash/lang/isFunction';
import isUndefined from 'lodash/lang/isUndefined';
import isNull from 'lodash/lang/isNull';
import assign from 'lodash/object/assign';

import {PropertyBuilder} from './PropertyBuilder';

export function getAttValue(el, attrName, isBoolean) {
    return isBoolean ? el.hasAttribute(attrName) : el.getAttribute(attrName);
}

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
 * Its goal is to provide a user friendly way to define an attribute.
 * @extends {PropertyBuilder}
 */
export class AttributeBuilder extends PropertyBuilder {

    constructor(attrName) {
        super(camelCase(attrName));
        assign(this.data, {
            attrName,
            getterFactory,
            setterFactory,
            descriptorValue: false,
            getAttValue: getAttValue,
            setAttValue: setAttValue
        });
    }

    boolean() {
        this.data.boolean = true;
        return this;
    }

    prop(propName) {
        this.data.propName = propName;
        return this;
    }

    build(proto, on) {
        var attGetter = this.data.getter;
        var attSetter = this.data.setter;

        this.data.getter = this.data.getterFactory(this.data.attrName, this.data.boolean, attGetter);
        this.data.setter = this.data.setterFactory(this.data.attrName, this.data.boolean, attSetter);

        super.build(proto, on);

        on('before:attributeChangedCallback').invoke((el, attName, oldVal, newVal) => {
            // Synchronize the attribute value with its properties
            if (attName === this.data.attrName) {
                if (el[this.data.propName] !== newVal) {
                    el[this.data.propName] = newVal;
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

