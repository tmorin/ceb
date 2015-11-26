'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../helper/types.js', '../helper/functions.js', '../helper/converters.js', '../helper/arrays.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../helper/types.js'), require('../helper/functions.js'), require('../helper/converters.js'), require('../helper/arrays.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.types, global.functions, global.converters, global.arrays);
        global.element = mod.exports;
    }
})(this, function (exports, _types, _functions, _converters, _arrays) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ElementBuilder = undefined;
    exports.element = element;

    function _typeof(obj) {
        return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    }

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

    var LIFECYCLE_CALLBACKS = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    var LIFECYCLE_EVENTS = (0, _arrays.flatten)(LIFECYCLE_CALLBACKS.map(function (name) {
        return ['before:' + name, 'after:' + name];
    }));

    function applyLifecycle(context, name) {
        var proto = context.p,
            original = proto[name],
            beforeFns = context.events['before:' + name],
            afterFns = context.events['after:' + name];

        proto[name] = function () {
            var _this = this;

            var args = [this].concat((0, _converters.toArray)(arguments));
            beforeFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });

            if ((0, _types.isFunction)(original)) {
                original.apply(this, args);
            }

            afterFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });
        };
    }

    var ElementBuilder = (function () {
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
            this.context = {
                p: p,
                builders: builders,
                events: events
            };
        }

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

                return {
                    invoke: invoke
                };
            }
        }, {
            key: 'register',
            value: function register(name) {
                var _this4 = this;

                this.context.events['before:builders'].forEach(function (fn) {
                    return fn(_this4.context);
                });
                (0, _arrays.invoke)(this.context.builders, 'build', this.context.p, (0, _functions.bind)(this.on, this));
                this.context.events['after:builders'].forEach(function (fn) {
                    return fn(_this4.context);
                });
                LIFECYCLE_CALLBACKS.forEach((0, _functions.partial)(applyLifecycle, this.context));
                var options = {
                    prototype: this.context.p
                };

                if ((0, _types.isString)(this.context.e)) {
                    options.extends = this.context.e;
                }

                this.context.events['before:registerElement'].forEach(function (fn) {
                    return fn(_this4.context);
                });
                var CustomElement = document.registerElement(name, options);
                this.context.events['after:registerElement'].forEach(function (fn) {
                    return fn(CustomElement);
                });
                return CustomElement;
            }
        }]);

        return ElementBuilder;
    })();

    exports.ElementBuilder = ElementBuilder;

    function element() {
        return new ElementBuilder();
    }
});