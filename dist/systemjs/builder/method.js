'use strict';

System.register(['../helper/types.js', '../helper/functions.js', '../helper/converters.js', './Builder'], function (_export, _context) {
    "use strict";

    var isFunction, partial, bind, toArray, Builder, _createClass, MethodBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
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
        }, function (_Builder2) {
            Builder = _Builder2.default;
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

            _export('MethodBuilder', MethodBuilder = function (_Builder) {
                _inherits(MethodBuilder, _Builder);

                /**
                 * @param {!string} methName the name of the method
                 */
                function MethodBuilder(methName) {
                    _classCallCheck(this, MethodBuilder);

                    var _this = _possibleConstructorReturn(this, (MethodBuilder.__proto__ || Object.getPrototypeOf(MethodBuilder)).call(this));

                    /**
                     * @ignore
                     */
                    _this.data = { methName: methName, wrappers: [] };
                    return _this;
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
                                    (function () {
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
                                    })();
                                }
                            });
                        }
                    }
                }]);

                return MethodBuilder;
            }(Builder));

            _export('MethodBuilder', MethodBuilder);
        }
    };
});