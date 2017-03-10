import {isString, isFunction} from '../helper/types.js';
import {partial, bind} from '../helper/functions.js';
import {toArray} from '../helper/converters.js';
import {flatten, invoke} from '../helper/arrays.js';

const LIFECYCLE_CALLBACKS = [
    'createdCallback',
    'attachedCallback',
    'detachedCallback',
    'attributeChangedCallback'
];

const LIFECYCLE_EVENTS = flatten(LIFECYCLE_CALLBACKS.map(name => [`before:${name}`, `after:${name}`]));

function applyLifecycle(context, name) {
    let proto = context.p,
        original = proto[name],
        beforeFns = context.events['before:' + name],
        afterFns = context.events['after:' + name];

    proto[name] = function () {
        let args = toArray(arguments);
        if (args[0] != this) {
            args.unshift(this);
        }

        beforeFns.forEach(fn => fn.apply(this, args));

        if (isFunction(original)) {
            original.apply(this, args);
        }

        afterFns.forEach(fn => fn.apply(this, args));
    };
}

/**
 * @typedef {Object} Builder
 * @description the base of a builder
 * @property {function(proto: Object, on: function)} build execute the business logic of the builder
 */

/**
 * The custom element builder.
 * Its goal is to provide a user friendly way to build custom element by some else (i.e. dedicated builders).
 */
export class ElementBuilder {

    /**
     */
    constructor() {
        let p = Object.create(HTMLElement.prototype),
            builders = [],
            events = LIFECYCLE_EVENTS.reduce((a, b) => {
                a[b] = [];
                return a;
            }, {
                'before:builders': [],
                'after:builders': [],
                'before:registerElement': [],
                'after:registerElement': []
            });
        /**
         * @type {Object}
         * @property {!Object} p - the prototype
         * @property {!string} e - the name of a native element
         * @desc the context of the builder
         */
        this.context = {p, builders, events};
    }

    /**
     * Set the basement of the future custom element, i.e. the prototype and/or the extends value.
     * Prototype and extends value can be swapped.
     * @example
     * element().base(prototypeValue, extendsValue);
     * element().base(extendsValue, prototypeValue);
     * element().base(extendsValue);
     * element().base(prototypeValue);
     * @param {!(string|Object)} arg1 the prototype or the name of the native element
     * @param {string|Object} [arg2] the prototype or the name of the native element
     * @returns {ElementBuilder} the builder
     */
    base(arg1, arg2) {
        let arg1Type = typeof arg1;
        let p = arg1Type === 'string' ? arg2 : arg1;
        let e = arg1Type === 'string' ? arg1 : arg2;
        if (p) {
            this.context.p = p;
        }
        if (e) {
            this.context.e = e;
        }
        return this;
    }

    /**
     * To apply the given builders during the build process.
     * @param {...Builder} builders the builders
     * @returns {ElementBuilder} the builder
     */
    builders(...builders) {
        builders.forEach(builder => this.context.builders.push(builder));
        return this;
    }

    /**
     * To register call back on events.
     * @param {!string} event the event name
     * @returns {Object} the on builder.
     * @property {function(callback: function)} invoke - to register the callback
     */
    on(event) {
        let invoke = cb => {
            this.context.events[event].push(cb);
            return this;
        };
        return {invoke};
    }

    /**
     * To register the custom element.
     * @param {!string} name the name of the cutsom element
     * @returns {Element} the custom element Type
     */
    register(name) {
        this.context.elName = name;
        this.context.events['before:builders'].forEach(fn => fn(this.context));

        invoke(this.context.builders, 'build', this.context.p, bind(this.on, this));

        this.context.events['after:builders'].forEach(fn => fn(this.context));

        LIFECYCLE_CALLBACKS.forEach(partial(applyLifecycle, this.context));

        this.context.events['before:registerElement'].forEach(fn => fn(this.context));

        let CustomElement;

        if (isString(this.context.e)) {
            CustomElement = document.registerElement(name, {
                prototype: this.context.p,
                extends: this.context.e
            });
        } else {
            CustomElement = document.registerElement(name, {
                prototype: this.context.p
            });
        }

        this.context.events['after:registerElement'].forEach(fn => fn(CustomElement));

        return CustomElement;
    }
}

/**
 * Get a new custom element builder.
 * @returns {ElementBuilder} the custom element builder
 */
export function element() {
    return new ElementBuilder();
}
