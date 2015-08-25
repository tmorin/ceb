System.register([], function (_export) {
    /**
     * @ignore
     */
    'use strict';

    /**
     * @ignore
     */

    _export('camelCase', camelCase);

    /**
     * @ignore
     */

    _export('isFunction', isFunction);

    /**
     * @ignore
     */

    _export('isUndefined', isUndefined);

    /**
     * @ignore
     */

    _export('isNull', isNull);

    /**
     * @ignore
     */

    _export('isString', isString);

    /**
     * @ignore
     */

    _export('isArray', isArray);

    /**
     * @ignore
     */

    _export('result', result);

    /**
     * @ignore
     */

    _export('assign', assign);

    /**
     * @ignore
     */

    _export('toArray', toArray);

    /**
     * @ignore
     */

    _export('flatten', flatten);

    /**
     * @ignore
     */

    _export('invoke', invoke);

    /**
     * @ignore
     */

    _export('partial', partial);

    /**
     * @ignore
     */

    _export('bind', bind);

    /**
     * @ignore
     */

    _export('noop', noop);

    /**
     * @ignore
     */

    _export('wrap', wrap);

    _export('find', find);

    function camelCase(value) {
        return value.split(/(?=[A-Z])/).map(function (part) {
            return part.charAt(0).toLowerCase() + part.slice(1);
        }).join('-');
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

    function wrap(fn, wrapper) {
        return partial(wrapper, fn);
    }

    function find(array, cb) {
        return array.filter(cb)[0];
    }

    return {
        setters: [],
        execute: function () {}
    };
});