import isFunction from 'lodash/lang/isFunction';
import isUndefined from 'lodash/lang/isUndefined';
import wrap from 'lodash/function/wrap';

export class DelegateBuilder {

    constructor(fieldBuilder) {
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

        fieldBuilderData.descriptorValue = false;
        var fieldGetter = fieldBuilderData.getter;
        var fieldSetter = fieldBuilderData.setter;

        if (!fieldBuilderData.attrName) {
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

export default function (attName) {
    return new DelegateBuilder(attName);
}
