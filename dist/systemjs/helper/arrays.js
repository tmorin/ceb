'use strict';

System.register(['./types.js'], function (_export) {
    var isArray, isFunction;
    return {
        setters: [function (_typesJs) {
            isArray = _typesJs.isArray;
            isFunction = _typesJs.isFunction;
        }],
        execute: function () {
            function flatten(array) {
                return array.reduce(function (a, b) {
                    return isArray(b) ? a.concat(flatten(b)) : a.concat(b);
                }, []);
            }

            _export('flatten', flatten);

            function invoke(objects, methName) {
                for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    args[_key - 2] = arguments[_key];
                }

                if (isArray(objects)) {
                    return objects.filter(function (obj) {
                        return isFunction(obj[methName]);
                    }).map(function (obj) {
                        return obj[methName].apply(obj, args);
                    });
                }

                return [];
            }

            _export('invoke', invoke);
        }
    };
});