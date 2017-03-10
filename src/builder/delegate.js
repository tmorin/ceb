import {isUndefined, isFunction} from '../helper/types.js';
import {toArray} from '../helper/converters.js';
import {getAttValue, setAttValue} from './attribute.js';
import Builder from './Builder';

/**
 * The delegate builder.
 * Its goal is to provide a way to delegate methods, properties and attributes.
 */
export class DelegateBuilder extends Builder {

    /**
     * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} fieldBuilder the field builder
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
        } else if (this.fieldBuilder.data.methName) {
            this.data.methName = fieldBuilder.data.methName;
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
     * To force the delegation to a property.
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
     * To force the delegation to an attribute.
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
     * To force the delegation to a method.
     * @param {string} [methName] the name of the method
     * @returns {DelegateBuilder} the builder
     */
    method(methName) {
        this.data.methName = null;
        if (!isUndefined(methName)) {
            this.data.methName = methName;
        } else {
            this.data.methName = this.fieldBuilder.data.methName;
        }
        return this;
    }

    /**
     * Logic of the builder.
     * @param {!ElementBuilder.context.p} proto the prototype
     * @param {!ElementBuilder.on} on the method on
     */
    build(proto, on) {
        let data = this.data,
            fieldBuilderData = this.fieldBuilder.data,
            targetedPropName = this.data.propName,
            targetedMethName = this.data.methName,
            targetedAttrName = this.data.attrName,
            fieldGetter = fieldBuilderData.getter,
            fieldSetter = fieldBuilderData.setter;

        if (fieldBuilderData.attrName) {
            fieldBuilderData.getterFactory = (attrName, isBoolean) => {
                return function () {
                    let target = this.querySelector(data.selector);
                    if (target) {
                        return targetedAttrName ? getAttValue(target, targetedAttrName, isBoolean) : target[targetedPropName];
                    }
                };
            };
            fieldBuilderData.setterFactory = (attrName, isBoolean) => {
                return function (value) {
                    let target = this.querySelector(data.selector),
                        attrValue = value;
                    if (target) {
                        if (targetedAttrName) {
                            setAttValue(target, targetedAttrName, isBoolean, attrValue);
                        } else {
                            target[targetedPropName] = attrValue;
                        }
                        setAttValue(this, attrName, isBoolean, attrValue);
                    }
                };
            };
        } else if (fieldBuilderData.propName) {
            fieldBuilderData.descriptorValue = false;
            fieldBuilderData.getter = (el) => {
                let target = el.querySelector(data.selector),
                    targetValue;
                if (target) {
                    if (targetedAttrName) {
                        targetValue = target.getAttribute(targetedAttrName);
                    } else {
                        targetValue = target[targetedPropName];
                    }
                }
                return isFunction(fieldGetter) ? fieldGetter.call(el, el, targetValue) : targetValue;
            };
            fieldBuilderData.setter = (el, value) => {
                let target = el.querySelector(data.selector),
                    targetValue = isFunction(fieldSetter) ? fieldSetter.call(el, el, value) : value;
                if (target) {
                    if (targetedAttrName) {
                        target.setAttribute(targetedAttrName, targetValue);
                    } else {
                        target[targetedPropName] = targetValue;
                    }
                }
            };
        } else if (fieldBuilderData.methName) {
            fieldBuilderData.invoke = function (el) {
                let target = el.querySelector(data.selector);
                if (isFunction(target[targetedMethName])) {
                    let args = toArray(arguments);
                    if (!fieldBuilderData.native) {
                        args.shift();
                    }
                    return target[targetedMethName].apply(target, args);
                }
            };
        }

        this.fieldBuilder.build(proto, on);
    }

}

/**
 * Get a new delegate builder.
 * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} builder a property, attribute or method builder
 * @returns {DelegateBuilder} the delegate builder
 */
export function delegate(builder) {
    return new DelegateBuilder(builder);
}
