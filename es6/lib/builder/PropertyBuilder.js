import isFunction from 'lodash/lang/isFunction.js';
import isUndefined from 'lodash/lang/isUndefined.js';
import result from 'lodash/object/result.js';
import assign from 'lodash/object/assign.js';

import Builder from './Builder.js';

const DEFAULT_DATA = {
    enumerable: true,
    immutable: false,
    descriptorValue: true
};

/**
 * The property builder.
 * Its goal is to provide a way to define a property.
 * @extends {Builder}
 */
export class PropertyBuilder extends Builder {

    /**
     * @param {!string} propName the name of the property
     */
    constructor(propName) {
        super();
        /**
         * @ignore
         */
        this.data = assign({propName}, DEFAULT_DATA);
    }

    /**
     * To make an immutable property.
     * @returns {PropertyBuilder} the builder
     */
    immutable() {
        this.data.immutable = true;
        return this;
    }

    /**
     * To hide the property name when using <code>Object.keys()</code>.
     * @returns {PropertyBuilder} the builder
     */
    hidden() {
        this.data.enumerable = false;
        return this;
    }

    /**
     * To set a default value.
     * @param {*} value the default value
     * @returns {PropertyBuilder} the builder
     */
    value(value) {
        this.data.value = value;
        return this;
    }

    /**
     * To set a getter function.
     * @param {function(el: HTMLElement): *} fn the getter function
     * @returns {PropertyBuilder} the builder
     */
    getter(fn) {
        this.data.descriptorValue = false;
        this.data.getter = fn;
        return this;
    }

    /**
     * To set a setter function.
     * @param {function(el: HTMLElement, value: *)} fn the setter function
     * @returns {PropertyBuilder} the builder
     */
    setter(fn) {
        this.data.descriptorValue = false;
        this.data.setter = fn;
        return this;
    }

    /**
     * @ignore
     */
    build(proto, on) {
        var data = this.data;

        var descriptor = {
            enumerable: this.data.enumerable
        };

        if (this.data.immutable) {
            descriptor.configurable = false;
            descriptor.writable = false;
        } else if (isFunction(this.data.getter) || isFunction(this.data.setter)) {
            descriptor.configurable = false;
            descriptor.get = function () {
                return data.getter.call(this, this);
            };
            descriptor.set = function (value) {
                return data.setter.call(this, this, value);
            };
        } else {
            descriptor.configurable = true;
            descriptor.writable = true;
        }

        if (this.data.descriptorValue) {
            descriptor.value = result(this.data, 'value');
        }

        Object.defineProperty(proto, this.data.propName, descriptor);

        on('after:createdCallback').invoke(el => {
            if (!this.data.descriptorValue) {
                var value = result(this.data, 'value');
                if (!isUndefined(value)) {
                    el[this.data.propName] = value;
                }
            }
        });
    }

}

/**
 * @ignore
 */
export default function helper(propName) {
    return new PropertyBuilder(propName);
}

