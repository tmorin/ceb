'use strict';

System.register(['../helper/types.js', '../helper/functions.js', '../helper/converters.js'], function (_export, _context) {
    "use strict";

    var isFunction, partial, bind, toArray, _createClass, MethodBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    /**
     * Get a new method builder.
     * @param {!string} methName the name of the method
     * @returns {MethodBuilder} the method builder
     */
    function method(methName) {
        return new MethodBuilder(methName);
    }

    _export('method', method);

    return {
        setters: [function (_helperTypesJs) {
            isFunction = _helperTypesJs.isFunction;
        }, function (_helperFunctionsJs) {
            partial = _helperFunctionsJs.partial;
            bind = _helperFunctionsJs.bind;
        }, function (_helperConvertersJs) {
            toArray = _helperConvertersJs.toArray;
        }],
        execute: function () {
            _createClass = function () {
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
            }();

            _export('MethodBuilder', MethodBuilder = function () {

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
                        if (isFunction(fn)) {
                            this.data.invoke = fn;
                        }
                        return this;
                    }
                }, {
                    key: 'wrap',
                    value: function wrap() {
                        for (var _len = arguments.length, wrappers = Array(_len), _key = 0; _key < _len; _key++) {
                            wrappers[_key] = arguments[_key];
                        }

                        this.data.wrappers = this.data.wrappers.concat(wrappers);
                        return this;
                    }
                }, {
                    key: 'native',
                    value: function native() {
                        this.data.native = true;
                        return this;
                    }
                }, {
                    key: 'build',
                    value: function build(proto, on) {
                        var data = this.data;

                        if (data.invoke) {
                            proto[data.methName] = function () {
                                var args = toArray(arguments);
                                if (!data.native && args[0] != this) {
                                    args.unshift(this);
                                }
                                return data.invoke.apply(this, args);
                            };
                        }

                        if (data.wrappers.length) {
                            on('before:createdCallback').invoke(function (el) {
                                if (isFunction(el[data.methName])) {
                                    var lastIndex = data.wrappers.length - 1,
                                        original = el[data.methName],
                                        target = function target() {
                                        var args = toArray(arguments);
                                        if (!data.native) {
                                            args.shift();
                                        }
                                        original.apply(el, args);
                                    };
                                    el[data.methName] = data.wrappers.reduce(function (next, current, index) {
                                        if (index === lastIndex) {
                                            return bind(data.native ? partial(current, next) : partial(current, next, el), el);
                                        }
                                        return bind(partial(current, next), el);
                                    }, target);
                                }
                            });
                        }
                    }
                }]);

                return MethodBuilder;
            }());

            _export('MethodBuilder', MethodBuilder);
        }
    };
});