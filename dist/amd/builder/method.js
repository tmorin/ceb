'use strict';

define(['exports', '../helper/type.js', '../helper/function.js', '../helper/converter.js'], function (exports, _type, _function, _converter) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MethodBuilder = undefined;
    exports.method = method;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    var MethodBuilder = exports.MethodBuilder = (function () {

        /**
         * @param {!string} methName the name of the method
         */

        function MethodBuilder(methName) {
            _classCallCheck(this, MethodBuilder);

            /**
             * @ignore
             */
            this.data = { methName: methName, wrappers: [] };
        }

        /**
         * To do something when invoked.
         * @param {!function(el: HTMLElement, args: ...*)} fn the method's logic
         * @returns {MethodBuilder} the builder
         */

        _createClass(MethodBuilder, [{
            key: 'invoke',
            value: function invoke(fn) {
                if ((0, _type.isFunction)(fn)) {
                    this.data.invoke = fn;
                }
                return this;
            }

            /**
             * To do something around the invocation.
             * @param {...function(el: HTMLElement, args: ...*)} wrappers a set of wrappers
             * @returns {MethodBuilder} the builder
             */

        }, {
            key: 'wrap',
            value: function wrap() {
                for (var _len = arguments.length, wrappers = Array(_len), _key = 0; _key < _len; _key++) {
                    wrappers[_key] = arguments[_key];
                }

                this.data.wrappers = this.data.wrappers.concat(wrappers);
                return this;
            }

            /**
             * Logic of the builder.
             * @param {!ElementBuilder.context.proto} proto the prototype
             * @param {!ElementBuilder.on} on the method on
             */

        }, {
            key: 'build',
            value: function build(proto, on) {
                var data = this.data;

                if (data.invoke) {
                    proto[data.methName] = function () {
                        return data.invoke.apply(this, [this].concat((0, _converter.toArray)(arguments)));
                    };
                }

                if (data.wrappers.length) {
                    on('before:createdCallback').invoke(function (el) {
                        if ((0, _type.isFunction)(el[data.methName])) {
                            (function () {
                                var lastIndex = data.wrappers.length - 1,
                                    original = el[data.methName],
                                    target = function target() {
                                    var args = (0, _converter.toArray)(arguments);
                                    args.shift();
                                    original.apply(el, args);
                                };
                                el[data.methName] = data.wrappers.reduce(function (next, current, index) {
                                    if (index === lastIndex) {
                                        return (0, _function.bind)((0, _function.partial)(current, next, el), el);
                                    }
                                    return (0, _function.bind)((0, _function.partial)(current, next), el);
                                }, target);
                            })();
                        }
                    });
                }
            }
        }]);

        return MethodBuilder;
    })();

    function method(methName) {
        return new MethodBuilder(methName);
    }
});