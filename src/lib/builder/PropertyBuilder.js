import isFunction from 'lodash/lang/isFunction';
import isUndefined from 'lodash/lang/isUndefined';
import result from 'lodash/object/result';
import assign from 'lodash/object/assign';

const DEFAULT_DATA = {
    enumerable: true,
    immutable: false,
    descriptorValue: true
};

export class PropertyBuilder {

    constructor(propName) {
        this.data = assign({propName}, DEFAULT_DATA);
    }

    immutable() {
        this.data.immutable = true;
        return this;
    }

    hidden() {
        this.data.enumerable = false;
        return this;
    }

    value(value) {
        this.data.value = value;
        return this;
    }

    getter(fn) {
        this.data.descriptorValue = false;
        this.data.getter = fn;
        return this;
    }

    setter(fn) {
        this.data.descriptorValue = false;
        this.data.setter = fn;
        return this;
    }

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

        on('before:createdCallback').invoke(el => {
            if (!this.data.descriptorValue) {
                var value = result(this.data, 'value');
                if (!isUndefined(value)) {
                    el[this.data.propName] = value;
                }
            }
        });
    }

}

export default function (propName) {
    return new PropertyBuilder(propName);
}

