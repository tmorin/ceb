'use strict';

System.register([], function (_export) {
    return {
        setters: [],
        execute: function () {
            function camelCase(value) {
                return value.toLowerCase().split('-').map(function (part, index) {
                    return index ? part.charAt(0).toUpperCase() + part.slice(1) : part;
                }).join('');
            }

            _export('camelCase', camelCase);

            function isFunction(i) {
                return Object.prototype.toString.call(i) === '[object Function]';
            }

            _export('isFunction', isFunction);

            function isUndefined(i) {
                return i === undefined;
            }

            _export('isUndefined', isUndefined);

            function isNull(i) {
                return i === null;
            }

            _export('isNull', isNull);

            function isString(i) {
                return Object.prototype.toString.call(i) === '[object String]';
            }

            _export('isString', isString);

            function isArray(i) {
                return Object.prototype.toString.call(i) === '[object Array]';
            }

            _export('isArray', isArray);

            function result(obj, prop) {
                var value = obj[prop];
                return isFunction(value) ? value() : value;
            }

            _export('result', result);

            function assign() {
                return Array.prototype.reduce.call(arguments, function (target, source) {
                    return Object.keys(Object(source)).reduce(function (target, key) {
                        target[key] = source[key];
                        return target;
                    }, target);
                });
            }

            _export('assign', assign);

            function toArray(i) {
                return Array.prototype.slice.call(i);
            }

            _export('toArray', toArray);

            function flatten(array) {
                return array.reduce(function (a, b) {
                    return isArray(b) ? a.concat(flatten(b)) : a.concat(b);
                }, []);
            }

            _export('flatten', flatten);

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

            _export('invoke', invoke);

            function partial() {
                var args = toArray(arguments),
                    fn = args.shift();
                return function () {
                    return fn.apply(this, args.concat(toArray(arguments)));
                };
            }

            _export('partial', partial);

            function bind(fn, ctx) {
                return function () {
                    return fn.apply(ctx, toArray(arguments));
                };
            }

            _export('bind', bind);

            function noop() {
                return function () {};
            }

            _export('noop', noop);

            function find(array, cb) {
                return array.filter(cb)[0];
            }

            _export('find', find);

            function dispatch(el, name) {
                var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(name, options.bubbles !== false, options.cancelable !== false, options.detail || {});
                return el.dispatchEvent(evt);
            }

            _export('dispatch', dispatch);
        }
    };
});