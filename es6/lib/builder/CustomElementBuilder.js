import {isString, isFunction, toArray, flatten, invoke, partial, bind} from '../utils.js';

const LIFECYCLE_CALLBACKS = [
    'createdCallback',
    'attachedCallback',
    'detachedCallback',
    'attributeChangedCallback'
];

const LIFECYCLE_EVENTS = flatten(LIFECYCLE_CALLBACKS.map(name => [`before:${name}`, `after:${name}`]));

/**
 * The custom element builder.
 * Its goal is to provide a user friendly way to do it by some else (i.e. dedicated builders).
 */
export class CustomElementBuilder {

    /**
     */
    constructor() {
        let proto = Object.create(HTMLElement.prototype),
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
         * @property {!Object} proto - the prototype
         * @property {!string} extends - the name of a native element
         * @desc the context of the builder
         */
        this.context = {proto, builders, events};
    }

    /**
     * To extend a native element.
     * @param {!string} value the name of the element
     * @returns {CustomElementBuilder} the builder
     */
    extends(value) {
        this.context.extends = value;
        return this;
    }

    /**
     * To override the default prototype.
     * @param {!Object} value the prototype
     * @returns {CustomElementBuilder} the builder
     */
    proto(value) {
        this.context.proto = value;
        return this;
    }

    /**
     * To apply the given builders during the build process.
     * @param {...Builder} builders the builders
     * @returns {CustomElementBuilder} the builder
     */
    augment(...builders) {
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
        this.context.events['before:builders'].forEach(fn => fn(this.context));

        invoke(this.context.builders, 'build', this.context.proto, bind(this.on, this));

        this.context.events['after:builders'].forEach(fn => fn(this.context));

        LIFECYCLE_CALLBACKS.forEach(partial(applyLifecycle, this.context));

        let options = {prototype: this.context.proto};

        if (isString(this.context.extends)) {
            options.extends = this.context.extends;
        }

        this.context.events['before:registerElement'].forEach(fn => fn(this.context));

        let CustomElement = document.registerElement(name, options);

        this.context.events['after:registerElement'].forEach(fn => fn(CustomElement));

        return CustomElement;
    }
}

function applyLifecycle(context, name) {
    let proto = context.proto,
        original = proto[name],
        beforeFns = context.events['before:' + name],
        afterFns = context.events['after:' + name];

    proto[name] = function () {
        let args = [this].concat(toArray(arguments));

        beforeFns.forEach(fn => fn.apply(this, args));

        if (isFunction(original)) {
            original.apply(this, args);
        }

        afterFns.forEach(fn => fn.apply(this, args));
    };
}
