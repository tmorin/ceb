import {isFunction, isUndefined} from '../helper/types.js';
import {result, assign} from '../helper/objects.js';

const DEFAULT_DATA = {
    enumerable: true,
    immutable: false,
    descriptorValue: true
};

/**
 * The property builder.
 * Its goal is to provide a way to define a property.
 */
export class PropertyBuilder {

    /**
     * @param {!string} propName the name of the property
     */
    constructor(propName) {
        /**
         * @ignore
         */
        this.data = assign({propName, listeners: []}, DEFAULT_DATA);
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
     * To be notified when the property is updated.
     * @param {function(el: HTMLElement, oldVal: *, newVal: *)} listener the listener function
     * @returns {PropertyBuilder} the builder
     */
    listen(listener) {
        this.data.listeners.push(listener);
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
                if (data.getter) {
                    return data.getter.call(this, this);
                }
            };
            descriptor.set = function (value) {
                if (data.setter) {
                    return data.setter.call(this, this, value);
                }
            };
        } else {
            descriptor.configurable = true;
            descriptor.writable = true;
        }

        if (data.listeners.length > 0) {
            descriptor.configurable = false;
            delete descriptor.writable;
            data.descriptorValue = false;
            let _propName = '__' + data.propName + 'LastSetValue';
            if (!descriptor.get) {
                descriptor.get = function () {
                    return this[_propName];
                };
            }
            descriptor.set = function (newVal) {
                let oldVal = this[_propName];
                this[_propName] = newVal;
                if (data.setter) {
                    data.setter.call(this, this, newVal);
                }
                data.listeners.forEach(listener => {
                    listener.call(this, this, oldVal, newVal);
                });
            };
        }

        if (data.descriptorValue) {
            descriptor.value = defaultValue;
        }

        Object.defineProperty(proto, this.data.propName, descriptor);

        on('after:createdCallback').invoke(el => {
            if (!data.descriptorValue && !isUndefined(defaultValue)) {
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
