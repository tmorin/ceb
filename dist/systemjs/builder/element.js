'use strict';

System.register(['../helper/types.js', '../helper/functions.js', '../helper/converters.js', '../helper/arrays.js'], function (_export, _context) {
    "use strict";

    var isString, isFunction, partial, bind, toArray, flatten, invoke, _typeof, _createClass, LIFECYCLE_CALLBACKS, LIFECYCLE_EVENTS, ElementBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function applyLifecycle(context, name) {
        var proto = context.p,
            original = proto[name],
            beforeFns = context.events['before:' + name],
            afterFns = context.events['after:' + name];

        proto[name] = function () {
            var _this = this;

            var args = [this].concat(toArray(arguments));

            beforeFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });

            if (isFunction(original)) {
                original.apply(this, args);
            }

            afterFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });
        };
    }

    /**
     * @typedef {Object} Builder
     * @description the base of a builder
     * @property {function(proto: Object, on: function)} build execute the business logic of the builder
     */

    /**
     * The custom element builder.
     * Its goal is to provide a user friendly way to build custom element by some else (i.e. dedicated builders).
     */


    /**
     * Get a new custom element builder.
     * @returns {ElementBuilder} the custom element builder
     */
    function element() {
        return new ElementBuilder();
    }

    _export('element', element);

    return {
        setters: [function (_helperTypesJs) {
            isString = _helperTypesJs.isString;
            isFunction = _helperTypesJs.isFunction;
        }, function (_helperFunctionsJs) {
            partial = _helperFunctionsJs.partial;
            bind = _helperFunctionsJs.bind;
        }, function (_helperConvertersJs) {
            toArray = _helperConvertersJs.toArray;
        }, function (_helperArraysJs) {
            flatten = _helperArraysJs.flatten;
            invoke = _helperArraysJs.invoke;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };

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

            LIFECYCLE_CALLBACKS = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
            LIFECYCLE_EVENTS = flatten(LIFECYCLE_CALLBACKS.map(function (name) {
                return ['before:' + name, 'after:' + name];
            }));

            _export('ElementBuilder', ElementBuilder = function () {

                /**
                 */
                function ElementBuilder() {
                    _classCallCheck(this, ElementBuilder);

                    var p = Object.create(HTMLElement.prototype),
                        builders = [],
                        events = LIFECYCLE_EVENTS.reduce(function (a, b) {
                        a[b] = [];
                        return a;
                    }, {
                        'before:builders': [],
                        'after:builders': [],
                        'before:registerElement': [],
                        'after:registerElement': []
                    });
                    /**
                     * @type {Object}
                     * @property {!Object} p - the prototype
                     * @property {!string} e - the name of a native element
                     * @desc the context of the builder
                     */
                    this.context = { p: p, builders: builders, events: events };
                }

                /**
                 * Set the basement of the future custom element, i.e. the prototype and/or the extends value.
                 * Prototype and extends value can be swapped.
                 * @example
                 * element().base(prototypeValue, extendsValue);
                 * element().base(extendsValue, prototypeValue);
                 * element().base(extendsValue);
                 * element().base(prototypeValue);
                 * @param {!(string|Object)} arg1 the prototype or the name of the native element
                 * @param {string|Object} [arg2] the prototype or the name of the native element
                 * @returns {ElementBuilder} the builder
                 */


                _createClass(ElementBuilder, [{
                    key: 'base',
                    value: function base(arg1, arg2) {
                        var arg1Type = typeof arg1 === 'undefined' ? 'undefined' : _typeof(arg1);
                        var p = arg1Type === 'string' ? arg2 : arg1;
                        var e = arg1Type === 'string' ? arg1 : arg2;
                        if (p) {
                            this.context.p = p;
                        }
                        if (e) {
                            this.context.e = e;
                        }
                        return this;
                    }
                }, {
                    key: 'builders',
                    value: function builders() {
                        var _this2 = this;

                        for (var _len = arguments.length, _builders = Array(_len), _key = 0; _key < _len; _key++) {
                            _builders[_key] = arguments[_key];
                        }

                        _builders.forEach(function (builder) {
                            return _this2.context.builders.push(builder);
                        });
                        return this;
                    }
                }, {
                    key: 'on',
                    value: function on(event) {
                        var _this3 = this;

                        var invoke = function invoke(cb) {
                            _this3.context.events[event].push(cb);
                            return _this3;
                        };
                        return { invoke: invoke };
                    }
                }, {
                    key: 'register',
                    value: function register(name) {
                        var _this4 = this;

                        this.context.events['before:builders'].forEach(function (fn) {
                            return fn(_this4.context);
                        });

                        invoke(this.context.builders, 'build', this.context.p, bind(this.on, this));

                        this.context.events['after:builders'].forEach(function (fn) {
                            return fn(_this4.context);
                        });

                        LIFECYCLE_CALLBACKS.forEach(partial(applyLifecycle, this.context));

                        this.context.events['before:registerElement'].forEach(function (fn) {
                            return fn(_this4.context);
                        });

                        var CustomElement = void 0;

                        if (isString(this.context.e)) {
                            CustomElement = document.registerElement(name, {
                                prototype: this.context.p,
                                extends: this.context.e
                            });
                        } else {
                            CustomElement = document.registerElement(name, {
                                prototype: this.context.p
                            });
                        }

                        this.context.events['after:registerElement'].forEach(function (fn) {
                            return fn(CustomElement);
                        });

                        return CustomElement;
                    }
                }]);

                return ElementBuilder;
            }());

            _export('ElementBuilder', ElementBuilder);
        }
    };
});