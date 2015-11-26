'use strict';

System.register(['./types.js'], function (_export) {
    var isFunction;
    return {
        setters: [function (_typesJs) {
            isFunction = _typesJs.isFunction;
        }],
        execute: function () {
            function result(object, propName) {
                var value = object[propName];
                return isFunction(value) ? value() : value;
            }

            _export('result', result);

            function assign(destination) {
                for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    sources[_key - 1] = arguments[_key];
                }

                return [destination].concat(sources).reduce(function (target, source) {
                    return Object.keys(Object(source)).reduce(function (target, key) {
                        target[key] = source[key];
                        return target;
                    }, target);
                });
            }

            _export('assign', assign);
        }
    };
});