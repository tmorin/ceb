define(['exports', './converters.js'], function (exports, _converters) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.partial = partial;
    exports.bind = bind;
    exports.noop = noop;

    function partial(fn) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return function () {
            return fn.apply(this, args.concat((0, _converters.toArray)(arguments)));
        };
    }

    function bind(fn, ctx) {
        return function () {
            return fn.apply(ctx, (0, _converters.toArray)(arguments));
        };
    }

    function noop() {
        return function () {};
    }
});