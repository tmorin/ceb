(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', './types.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('./types.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.types);
        global.arrays = mod.exports;
    }
})(this, function (exports, _types) {
    'use strict';

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