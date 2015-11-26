'use strict';

define(['exports', './types.js'], function (exports, _types) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.flatten = flatten;
    exports.invoke = invoke;

    function flatten(array) {
        return array.reduce(function (a, b) {
            return (0, _types.isArray)(b) ? a.concat(flatten(b)) : a.concat(b);
        }, []);
    }

    function invoke(objects, methName) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
        }

        if ((0, _types.isArray)(objects)) {
            return objects.filter(function (obj) {
                return (0, _types.isFunction)(obj[methName]);
            }).map(function (obj) {
                return obj[methName].apply(obj, args);
            });
        }

        return [];
    }
});