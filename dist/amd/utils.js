'use strict';

define(['exports'], function (exports) {
    Object.defineProperty(exports, "__esModule", {
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
    exports.find = find;
    exports.dispatch = dispatch;

    function camelCase(value) {
        return value.toLowerCase().split('-').map(function (part, index) {
            return index ? part.charAt(0).toUpperCase() + part.slice(1) : part;
        }).join('');
    }

    function isFunction(i) {
        return Object.prototype.toString.call(i) === '[object Function]';
    }

    function isUndefined(i) {
        return i === undefined;
    }

    function isNull(i) {
        return i === null;
    }

    function isString(i) {
        return Object.prototype.toString.call(i) === '[object String]';
    }

    function isArray(i) {
        return Object.prototype.toString.call(i) === '[object Array]';
    }

    function result(obj, prop) {
        var value = obj[prop];
        return isFunction(value) ? value() : value;
    }

    function assign() {
        return Array.prototype.reduce.call(arguments, function (target, source) {
            return Object.keys(Object(source)).reduce(function (target, key) {
                target[key] = source[key];
                return target;
            }, target);
        });
    }

    function toArray(i) {
        return Array.prototype.slice.call(i);
    }

    function flatten(array) {
        return array.reduce(function (a, b) {
            return isArray(b) ? a.concat(flatten(b)) : a.concat(b);
        }, []);
    }

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

    function partial() {
        var args = toArray(arguments),
            fn = args.shift();
        return function () {
            return fn.apply(this, args.concat(toArray(arguments)));
        };
    }

    function bind(fn, ctx) {
        return function () {
            return fn.apply(ctx, toArray(arguments));
        };
    }

    function noop() {
        return function () {};
    }

    function find(array, cb) {
        return array.filter(cb)[0];
    }

    function dispatch(el, name) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
        var detail = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(name, options.bubbles !== false, options.cancelable !== false, detail);
        return el.dispatchEvent(evt);
    }
});