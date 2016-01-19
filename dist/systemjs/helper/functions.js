'use strict';

System.register(['./converters.js'], function (_export, _context) {
    var toArray;
    return {
        setters: [function (_convertersJs) {
            toArray = _convertersJs.toArray;
        }],
        execute: function () {
            function partial(fn) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

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
        }
    };
});