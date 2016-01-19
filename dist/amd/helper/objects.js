define(['exports', './types.js'], function (exports, _types) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.result = result;
    exports.assign = assign;

    function result(object, propName) {
        var value = object[propName];
        return (0, _types.isFunction)(value) ? value() : value;
    }

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
});