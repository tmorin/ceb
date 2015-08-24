System.register([], function (_export) {
    'use strict';

    _export('camelCase', camelCase);

    _export('isFunction', isFunction);

    _export('isUndefined', isUndefined);

    _export('isNull', isNull);

    _export('isString', isString);

    _export('isArray', isArray);

    _export('result', result);

    _export('assign', assign);

    _export('toArray', toArray);

    _export('flatten', flatten);

    _export('invoke', invoke);

    _export('partial', partial);

    _export('bind', bind);

    _export('noop', noop);

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
        return function () {
            var args = toArray(arguments),
                next = isFunction(fn) ? fn : noop();
            return wrapper.apply(this, [bind(next, this)].concat(args));
        };
    }

    function find(array, cb) {
        return array.filter(cb)[0];
    }

    return {
        setters: [],
        execute: function () {}
    };
});