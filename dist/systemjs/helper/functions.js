'use strict';

System.register(['./converters.js'], function (_export, _context) {
    "use strict";

    var toArray;
    return {
        setters: [function (_convertersJs) {
            // obviously close to underscorejs and lodash ;)

            toArray = _convertersJs.toArray;
        }],
        execute: function () {

            /**
             * Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
             * @param {!Function} fn the function to partially apply arguments to
             * @param {...} args the arguments to be partially applied
             * @returns {Function} the new partially applied function
             */
            function partial(fn) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                return function () {
                    return fn.apply(this, args.concat(toArray(arguments)));
                };
            }

            /**
             * Creates a function that invokes fn with context the context ctx.
             * @param {!Function} fn the function to bind
             * @param ctx the context
             * @returns {Function} the new bound function
             */

            _export('partial', partial);

            function bind(fn, ctx) {
                return function () {
                    return fn.apply(ctx, toArray(arguments));
                };
            }

            /**
             * An empty function doing nothing.
             * @returns {Function} a new function doing nothing
             */

            _export('bind', bind);

            function noop() {
                return function () {};
            }

            _export('noop', noop);
        }
    };
});