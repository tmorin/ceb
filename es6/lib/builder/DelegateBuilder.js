import isFunction from 'lodash/lang/isFunction.js';
import isUndefined from 'lodash/lang/isUndefined.js';

import {getAttValue, setAttValue} from './AttributeBuilder.js';

import Builder from './Builder.js';

/**
 * The delegate builder.
 * Its goal is to provide a way to delegate properties and attributes.
 * @extends {Builder}
 */
export class DelegateBuilder extends Builder {

    /**
     * @param {!PropertyBuilder|AttributeBuilder} fieldBuilder the field builder
     */
    constructor(fieldBuilder) {
        super();
        /**
         * @ignore
         */
        this.fieldBuilder = fieldBuilder;
        /**
         * @ignore
         */
        this.data = {};
        if (fieldBuilder.data.attrName) {
            this.data.attrName = fieldBuilder.data.attrName;
        } else if (this.fieldBuilder.data.propName) {
            this.data.propName = fieldBuilder.data.propName;
        }
    }

    /**
     * The target of the delegate.
     * @param {!string} selector a valid css query
     * @returns {DelegateBuilder} the builder
     */
    to(selector) {
        this.data.selector = selector;
        return this;
    }

    /**
     * To force a delegate to a property.
     * @param {string} [propName] the name of the property
     * @returns {DelegateBuilder} the builder
     */
    property(propName) {
        this.data.attrName = null;
        if (!isUndefined(propName)) {
            this.data.propName = propName;
        } else {
            this.data.propName = this.fieldBuilder.data.propName;
        }
        return this;
    }

    /**
     * To force the delegate to an attribute.
     * @param {string} [attrName] the name of the attribute
     * @returns {DelegateBuilder} the builder
     */
    attribute(attrName) {
        this.data.propName = null;
        if (!isUndefined(attrName)) {
            this.data.attrName = attrName;
        } else {
            this.data.attrName = this.fieldBuilder.data.attrName || this.fieldBuilder.data.propName;
        }
        return this;
    }

    /**
     * @override
     */
    build(proto, on) {
        let data = this.data,
            fieldBuilderData = this.fieldBuilder.data,
            targetedPropName = this.data.propName,
            targetedAttrName = this.data.attrName,
            fieldGetter = fieldBuilderData.getter,
            fieldSetter = fieldBuilderData.setter;

        if (fieldBuilderData.attrName) {
            fieldBuilderData.getterFactory = (attrName, isBoolean) => {
                return (el) => {
                    let target = el.querySelector(data.selector);
                    return targetedAttrName ? getAttValue(target, targetedAttrName, isBoolean) : target[targetedPropName];
                };
            };
            fieldBuilderData.setterFactory = (attrName, isBoolean, attSetter) => {
                return (el, value) => {
                    let target = el.querySelector(data.selector),
                        attrValue = isFunction(attSetter) ? attSetter.call(el, el, value) : value;
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
                let target = el.querySelector(data.selector),
                    targetValue;
                if (targetedAttrName) {
                    targetValue = target.getAttribute(targetedAttrName);
                } else {
                    targetValue = target[targetedPropName];
                }
                return isFunction(fieldGetter) ? fieldGetter.call(this, this, targetValue) : targetValue;
            };
            fieldBuilderData.setter = (el, value) => {
                let target = el.querySelector(data.selector),
                    targetValue = isFunction(fieldSetter) ? fieldSetter.call(this, this, value) : value;
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