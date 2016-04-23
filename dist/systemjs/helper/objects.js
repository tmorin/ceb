'use strict';

System.register(['./types.js'], function (_export, _context) {
    var isFunction;
    return {
        setters: [function (_typesJs) {
            // obviously close to underscorejs and lodash ;)

            isFunction = _typesJs.isFunction;
        }],
        execute: function () {

            /**
             * Resolve the value of propName into object.
             * If the value is a function, it will be executed.
             * @param {!Object} object the object
             * @param {!string} propName the property name
             * @return the resolved value.
             */
            function result(object, propName) {
                var value = object[propName];
                return isFunction(value) ? value() : value;
            }

            /**
             * Assigns own enumerable properties of source object(s) to the destination object.
             * @param {!Object} destination the destination object
             * @param {...Object} [sources] the source objects
             * @returns {Object} the destination object
             */

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