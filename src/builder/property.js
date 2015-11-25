import {isFunction, isUndefined} from '../helper/type.js';
import {result, assign} from '../helper/object.js';

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
export class PropertyBuilder {

    /**
     * @param {!string} propName the name of the property
     */
    constructor(propName) {
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
     * Logic of the builder.
     * @param {!ElementBuilder.context.proto} proto the prototype
     * @param {!ElementBuilder.on} on the method on
     */
    build(proto, on) {
        let data = this.data,
            defaultValue = result(this.data, 'value'),
            descriptor = {
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
            descriptor.value = defaultValue;
        }

        Object.defineProperty(proto, this.data.propName, descriptor);

        on('after:createdCallback').invoke(el => {
            if (!this.data.descriptorValue && !isUndefined(defaultValue)) {
                el[data.propName] = defaultValue;
            }
        });
    }

}

/**
 * Get a new property builder.
 * @param {!string} propName the name of the property
 * @returns {PropertyBuilder} the property builder
 */
export function property(propName) {
    return new PropertyBuilder(propName);
}
