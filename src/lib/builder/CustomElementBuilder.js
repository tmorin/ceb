import isString from 'lodash/lang/isString';
import isFunction from 'lodash/lang/isFunction';
import toArray from 'lodash/lang/toArray';

import flatten from 'lodash/array/flatten';

import invoke from 'lodash/collection/invoke';

import partial from 'lodash/function/partial';
import bind from 'lodash/function/bind';

const LIFECYCLE_CALLBACKS = [
    'createdCallback',
    'attachedCallback',
    'detachedCallback',
    'attributeChangedCallback'
];

const LIFECYCLE_EVENTS = flatten(LIFECYCLE_CALLBACKS.map(name => [`before:${name}`, `after:${name}`]));

export class CustomElementBuilder {

    constructor(data) {
        var proto = Object.create(HTMLElement.prototype);
        var builders = [];
        var events = LIFECYCLE_EVENTS.reduce((a, b) => {
            a[b] = [];
            return a;
        }, {
            'before:builders': [],
            'after:builders': [],
            'before:registerElement': [],
            'after:registerElement': []
        });
        this.data = data || {proto, builders, events};
    }

    extends(value) {
        this.data.extends = value;
        return this;
    }

    proto(value) {
        this.data.proto = value;
        return this;
    }

    augment() {
        var builders = this.data.builders;
        toArray(arguments).forEach(builder => builders.push(builder));
        return this;
    }

    on(event) {
        var invoke = fn => {
            this.data.events[event].push(fn);
            return this;
        };
        return {invoke};
    }

    register(name) {
        this.data.events['before:builders'].forEach(fn => fn(this.data));

        invoke(this.data.builders, 'build', this.data.proto, bind(this.on, this));

        this.data.events['after:builders'].forEach(fn => fn(this.data));

        LIFECYCLE_CALLBACKS.forEach(partial(applyLifecycle, this.data));

        var options = {prototype: this.data.proto};

        if (isString(this.data.extends)) {
            options.extends = this.data.extends;
        }

        this.data.events['before:registerElement'].forEach(fn => fn(this.data));

        var CustomElement = document.registerElement(name, options);

        this.data.events['after:registerElement'].forEach(fn => fn(CustomElement));

        return CustomElement;
    }
}

export function applyLifecycle(data, name) {
    var proto = data.proto,
        original = proto[name],
        beforeFns = data.events['before:' + name],
        afterFns = data.events['after:' + name];

    proto[name] = function () {
        var args = [this].concat(toArray(arguments));

        beforeFns.forEach(fn => fn.apply(this, args));

        if (isFunction(original)) {
            original.apply(this, args);
        }

        afterFns.forEach(fn => fn.apply(this, args));
    };
}

export default function customElement(data) {
    return new CustomElementBuilder(data);
}

