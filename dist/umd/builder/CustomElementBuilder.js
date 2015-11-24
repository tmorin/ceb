'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../utils.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../utils.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils);
        global.CustomElementBuilder = mod.exports;
    }
})(this, function (exports, _utils) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.CustomElementBuilder = undefined;

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
    var LIFECYCLE_EVENTS = (0, _utils.flatten)(LIFECYCLE_CALLBACKS.map(function (name) {
        return ['before:' + name, 'after:' + name];
    }));

    function applyLifecycle(context, name) {
        var proto = context.proto,
            original = proto[name],
            beforeFns = context.events['before:' + name],
            afterFns = context.events['after:' + name];

        proto[name] = function () {
            var _this = this;

            var args = [this].concat((0, _utils.toArray)(arguments));
            beforeFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });

            if ((0, _utils.isFunction)(original)) {
                original.apply(this, args);
            }

            afterFns.forEach(function (fn) {
                return fn.apply(_this, args);
            });
        };
    }

    var CustomElementBuilder = (function () {
        function CustomElementBuilder() {
            _classCallCheck(this, CustomElementBuilder);

            var proto = Object.create(HTMLElement.prototype),
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
                proto: proto,
                builders: builders,
                events: events
            };
        }

        _createClass(CustomElementBuilder, [{
            key: 'extend',
            value: function extend(value) {
                this.context.extend = value;
                return this;
            }
        }, {
            key: 'proto',
            value: function proto(value) {
                this.context.proto = value;
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
                (0, _utils.invoke)(this.context.builders, 'build', this.context.proto, (0, _utils.bind)(this.on, this));
                this.context.events['after:builders'].forEach(function (fn) {
                    return fn(_this4.context);
                });
                LIFECYCLE_CALLBACKS.forEach((0, _utils.partial)(applyLifecycle, this.context));
                var options = {
                    prototype: this.context.proto
                };

                if ((0, _utils.isString)(this.context.extend)) {
                    options.extends = this.context.extend;
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

        return CustomElementBuilder;
    })();

    exports.CustomElementBuilder = CustomElementBuilder;
});