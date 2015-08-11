import camelCase from 'lodash/string/camelCase';
import isFunction from 'lodash/lang/isFunction';
import isUndefined from 'lodash/lang/isUndefined';
import isNull from 'lodash/lang/isNull';
import assign from 'lodash/object/assign';

import {PropertyBuilder}from './PropertyBuilder';

function getAttValue(el, attrName, isBoolean) {
    return isBoolean ? el.hasAttribute(attrName) : el.getAttribute(attrName);
}

function setAttValue(el, attrName, isBoolean, value) {
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

export class AttributeBuilder extends PropertyBuilder {

    constructor(attrName) {
        super(camelCase(attrName));
        assign(this.data, {
            attrName,
            descriptorValue: false,
            getAttValue: getAttValue,
            setAttValue: setAttValue
        });
    }

    boolean() {
        this.data.boolean = true;
        return this;
    }

    getter(fn) {
        return super.getter(fn);
    }

    setter(fn) {
        return super.setter(fn);
    }

    prop(propName) {
        this.data.propName = propName;
        return this;
    }

    build(proto, on) {
        var data = this.data;
        var attGetter = this.data.getter;
        var attSetter = this.data.setter;
        var getAttValue = this.data.getAttValue;
        var setAttValue = this.data.setAttValue;

        this.data.getter = (el) => {
            var attValue = getAttValue(el, data.attrName, data.boolean);
            return isFunction(attGetter) ? attGetter.call(el, el, attValue) : attValue;
        };

        this.data.setter = (el, value) => {
            var attValue = isFunction(attSetter) ? attSetter.call(el, el, value) : value;
            return setAttValue(el, data.attrName, data.boolean, attValue);
        };

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

export default function (attName) {
    return new AttributeBuilder(attName);
}

