(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.utils = mod.exports;
    }
})(this, function (exports) {
    /**
     * @ignore
     */
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });
    exports.camelCase = camelCase;
    exports.isFunction = isFunction;
    exports.isUndefined = isUndefined;
    exports.isNull = isNull;
    exports.isString = isString;
    exports.isArray = isArray;
    exports.result = result;
    exports.assign = assign;
    exports.toArray = toArray;
    exports.flatten = flatten;
    exports.invoke = invoke;
    exports.partial = partial;
    exports.bind = bind;
    exports.noop = noop;
    exports.wrap = wrap;
    exports.find = find;
    exports.trigger = trigger;

    function camelCase(value) {
        return value.toLowerCase().split('-').map(function (part, index) {
            return index ? part.charAt(0).toUpperCase() + part.slice(1) : part;
        }).join('');
    }

    /**
     * @ignore
     */

    function isFunction(i) {
        return Object.prototype.toString.call(i) === '[object Function]';
    }

    /**
     * @ignore
     */

    function isUndefined(i) {
        return i === undefined;
    }

    /**
     * @ignore
     */

    function isNull(i) {
        return i === null;
    }

    /**
     * @ignore
     */

    function isString(i) {
        return Object.prototype.toString.call(i) === '[object String]';
    }

    /**
     * @ignore
     */

    function isArray(i) {
        return Object.prototype.toString.call(i) === '[object Array]';
    }

    /**
     * @ignore
     */

    function result(obj, prop) {
        var value = obj[prop];
        return isFunction(value) ? value() : value;
    }

    /**
     * @ignore
     */

    function assign() {
        return Array.prototype.reduce.call(arguments, function (target, source) {
            return Object.keys(Object(source)).reduce(function (target, key) {
                target[key] = source[key];
                return target;
            }, target);
        });
    }

    /**
     * @ignore
     */

    function toArray(i) {
        return Array.prototype.slice.call(i);
    }

    /**
     * @ignore
     */

    function flatten(array) {
        return array.reduce(function (a, b) {
            return isArray(b) ? a.concat(flatten(b)) : a.concat(b);
        }, []);
    }

    /**
     * @ignore
     */

    function invoke() {
        var args = toArray(arguments),
            objects = args.shift(),
            meth = args.shift();
        if (isArray(objects)) {
            objects.filter(function (obj) {
                return isFunction(obj[meth]);
            }).forEach(function (obj) {
                return obj[meth].apply(obj, args);
            });
        }
    }

    /**
     * @ignore
     */

    function partial() {
        var args = toArray(arguments),
            fn = args.shift();
        return function () {
            return fn.apply(this, args.concat(toArray(arguments)));
        };
    }

    /**
     * @ignore
     */

    function bind(fn, ctx) {
        return function () {
            return fn.apply(ctx, toArray(arguments));
        };
    }

    /**
     * @ignore
     */

    function noop() {
        return function () {};
    }

    /**
     * @ignore
     */

    function wrap(fn, wrapper) {
        return partial(wrapper, fn);
    }

    /**
     * @ignore
     */

    function find(array, cb) {
        return array.filter(cb)[0];
    }

    /**
     * @ignore
     */

    function trigger(el, event, params) {
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancellable, params.detail);
        return el.dispatchEvent(evt);
    }
});