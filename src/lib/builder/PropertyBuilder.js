import {isUndefined} from 'lodash/lang';

export default class PropertyBuilder {

    constructor(propName) {
        this.property = {
            propName
        };
    }

    configurable(value) {
        this.property.configurable = !!value;
    }

    enumerable(value) {
        this.property.enumerable = !!value;
    }

    writable(value) {
        this.property.writable = !!value;
    }

    factory(cb) {
        this.property.factory = cb;
    }

    value(value) {
        this.property.value = value;
    }

    getter(fn) {
        this.property.getter = fn;
    }

    setter(fn) {
        this.property.setter = fn;
    }

    build(proto, on) {
        var data = {};

        if (!isUndefined(this.property.configurable)) {
            data.configurable = this.property.configurable;
        }

        if (!isUndefined(this.property.enumerable)) {
            data.enumerable = this.property.enumerable;
        }

        if (!isUndefined(this.property.value)) {
            data.value = this.property.value;
        }

        if (!isUndefined(this.property.writable)) {
            data.writable = this.property.writable;
        }

        if (!isUndefined(this.property.getter)) {
            data.get = this.property.getter;
        }

        if (!isUndefined(this.property.setter)) {
            data.set = this.property.setter;
        }

        Object.defineProperty(proto, this.property.propName, data);

        on('before:createdCallback', el => {

            if (!isUndefined(this.property.factory)) {
                el[this.property.propName] = this.property.factory(el);
            }

        });
    }

}
