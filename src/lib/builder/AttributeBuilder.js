import camelCase from 'lodash/string/camelCase';
import isFunction from 'lodash/lang/isFunction';
import isUndefined from 'lodash/lang/isUndefined';
import isNull from 'lodash/lang/isNull';
import assign from 'lodash/object/assign';

import property from './PropertyBuilder';

function getAttValue(el, attName, isBoolean) {
    return isBoolean ? el.hasAttribute(attName) : el.getAttribute(attName);
}

function setAttValue(el, attName, isBoolean, value) {
    if (isBoolean) {
        // Handle boolean value
        if (value && !el.hasAttribute(attName)) {
            el.setAttribute(attName, '');
        } else if (!value && el.hasAttribute(attName)) {
            el.removeAttribute(attName);
        }
    } else {
        // Handle none boolean value
        if ((isUndefined(value) || isNull(value)) && el.hasAttribute(attName)) {
            // There is no value, so the attribute must be removed
            el.removeAttribute(attName);
        } else if (!isUndefined(value) && !isNull(value) && el.getAttribute(attName) !== value) {
            // Sync the attribute value with value
            el.setAttribute(attName, value);
        }
    }
}

export class AttributeBuilder {

    constructor(attName) {
        var propName = camelCase(attName);
        this.data = assign({attName, propName});
    }

    boolean() {
        this.data.boolean = true;
        return this;
    }

    value(value) {
        this.data.value = value;
        return this;
    }

    getter(fn) {
        this.data.getter = fn;
        return this;
    }

    setter(fn) {
        this.data.setter = fn;
        return this;
    }

    delegate(propName) {
        this.data.propName = propName;
        return this;
    }

    build(proto, on) {
        var data = this.data;

        property(this.data.propName)
            .value(this.data.value)
            .getter((el) => {
                var attValue = getAttValue(el, data.attName, data.boolean);
                return isFunction(data.getter) ? data.getter(this, attValue) : attValue;
            })
            .setter((el, value) => {
                var attValue = isFunction(data.setter) ? data.setter(this, value) : value;
                setAttValue(el, data.attName, data.boolean, attValue);
            })
            .build(proto, on);

        on('before:attributeChangedCallback').invoke((el, attName, oldVal, newVal) => {
            // Synchronize the attribute value with its properties
            if (attName === this.data.attName) {
                if (el[this.data.propName] !== newVal) {
                    el[this.data.propName] = newVal;
                }
            }
        });
    }

}

export default function attribute(attName) {
    return new AttributeBuilder(attName);
}

