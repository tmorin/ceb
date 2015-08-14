import isFunction from 'lodash/lang/isFunction';
import isUndefined from 'lodash/lang/isUndefined';

import {getAttValue, setAttValue} from './AttributeBuilder';

import Builder from './Builder';

/**
 * The method builder.
 * Its goal is to provide a user friendly way to proxy properties and attributes.
 * @extends {Builder}
 */
export class DelegateBuilder extends Builder {

    constructor(fieldBuilder) {
        super();
        this.fieldBuilder = fieldBuilder;
        this.data = {};
        if (fieldBuilder.data.attrName) {
            this.data.attrName = fieldBuilder.data.attrName;
        } else if (this.fieldBuilder.data.propName) {
            this.data.propName = fieldBuilder.data.propName;
        }
    }

    to(selector) {
        this.data.selector = selector;
        return this;
    }

    property(propName) {
        this.data.attrName = null;
        if (!isUndefined(propName)) {
            this.data.propName = propName;
        } else {
            this.data.propName = this.fieldBuilder.data.propName;
        }
        return this;
    }

    attribute(attrName) {
        this.data.propName = null;
        if (!isUndefined(attrName)) {
            this.data.attrName = attrName;
        } else {
            this.data.attrName = this.fieldBuilder.data.attrName || this.fieldBuilder.data.propName;
        }
        return this;
    }

    build(proto, on) {
        var data = this.data;
        var fieldBuilderData = this.fieldBuilder.data;

        var targetedPropName = this.data.propName;
        var targetedAttrName = this.data.attrName;

        var fieldGetter = fieldBuilderData.getter;
        var fieldSetter = fieldBuilderData.setter;

        if (fieldBuilderData.attrName) {
            fieldBuilderData.getterFactory = (attrName, isBoolean) => {
                return (el) => {
                    var target = el.querySelector(data.selector);
                    return targetedAttrName ? getAttValue(target, targetedAttrName, isBoolean) : target[targetedPropName];
                };
            };
            fieldBuilderData.setterFactory = (attrName, isBoolean, attSetter) => {
                return (el, value) => {
                    var target = el.querySelector(data.selector);
                    var attrValue = isFunction(attSetter) ? attSetter.call(el, el, value) : value;
                    if (targetedAttrName) {
                        setAttValue(target, targetedAttrName, isBoolean, attrValue);
                    } else {
                        target[targetedPropName] = attrValue;
                    }
                    setAttValue(el, attrName, isBoolean, attrValue);
                };
            };
        } else if (fieldBuilderData.propName) {
            fieldBuilderData.descriptorValue = false;
            fieldBuilderData.getter = (el) => {
                var target = el.querySelector(data.selector);
                var targetValue;
                if (targetedAttrName) {
                    targetValue = target.getAttribute(targetedAttrName);
                } else {
                    targetValue = target[targetedPropName];
                }
                return isFunction(fieldGetter) ? fieldGetter.call(this, this, targetValue) : targetValue;
            };
            fieldBuilderData.setter = (el, value) => {
                var target = el.querySelector(data.selector);
                var targetValue = isFunction(fieldSetter) ? fieldSetter.call(this, this, value) : value;
                if (targetedAttrName) {
                    target.setAttribute(targetedAttrName, targetValue);
                } else {
                    target[targetedPropName] = targetValue;
                }
            };
        }

        this.fieldBuilder.build(proto, on);
    }

}

/**
 * @ignore
 */
export default function helper(attName) {
    return new DelegateBuilder(attName);
}
