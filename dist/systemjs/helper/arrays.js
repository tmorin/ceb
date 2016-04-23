'use strict';

System.register(['./types.js'], function (_export, _context) {
    var isArray, isFunction;
    return {
        setters: [function (_typesJs) {
            // obviously close to underscorejs and lodash ;)

            isArray = _typesJs.isArray;
            isFunction = _typesJs.isFunction;
        }],
        execute: function () {

            /**
             * Flattens a nested array.
             * @param {!Array} array the array to flatten
             * @returns {Array} the new flattened array
             */
            function flatten(array) {
                return array.reduce(function (a, b) {
                    return isArray(b) ? a.concat(flatten(b)) : a.concat(b);
                }, []);
            }

            /**
             * For each objects, invoke the method called methName with the arguments args.
             * @param {!Array<Object>} objects the objects
             * @param {!string} methName the name of the method
             * @param {...*} args the arguments to invoke the method with
             * @return {Array} the array of results
             */

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