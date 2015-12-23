'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../helper/types.js', '../helper/functions.js', '../helper/converters.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../helper/types.js'), require('../helper/functions.js'), require('../helper/converters.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.types, global.functions, global.converters);
        global.on = mod.exports;
    }
})(this, function (exports, _types, _functions, _converters) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.OnBuilder = undefined;
    exports.on = on;

    var _slicedToArray = (function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    })();

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

    var OnBuilder = exports.OnBuilder = (function () {
        function OnBuilder(events) {
            _classCallCheck(this, OnBuilder);

            this.data = {
                events: events,
                invoke: _functions.noop
            };
        }

        _createClass(OnBuilder, [{
            key: 'invoke',
            value: function invoke(fn) {
                if ((0, _types.isFunction)(fn)) {
                    this.data.invoke = fn;
                }

                return this;
            }
        }, {
            key: 'capture',
            value: function capture() {
                this.data.capture = true;
                return this;
            }
        }, {
            key: 'delegate',
            value: function delegate(selector) {
                this.data.selector = selector;
                return this;
            }
        }, {
            key: 'prevent',
            value: function prevent() {
                this.data.preventDefault = true;
                return this;
            }
        }, {
            key: 'stop',
            value: function stop() {
                this.data.stopPropagation = true;
                return this;
            }
        }, {
            key: 'skip',
            value: function skip() {
                return this.prevent().stop();
            }
        }, {
            key: 'build',
            value: function build(proto, on) {
                var events = this.data.events.split(',').map(function (event) {
                    return event.trim().split(' ');
                }),
                    capture = !!this.data.capture,
                    invoke = this.data.invoke,
                    selector = this.data.selector,
                    stopPropagation = this.data.stopPropagation,
                    preventDefault = this.data.preventDefault;
                on('before:createdCallback').invoke(function (el) {
                    if (!el.__cebOnHandlers) {
                        el.__cebOnHandlers = [];
                    }
                });
                on('before:attachedCallback').invoke(function (el) {
                    var listener = function listener(evt) {
                        if (selector) {
                            var target = (0, _converters.toArray)(el.querySelectorAll(selector)).filter(function (el) {
                                return el === evt.target || el.contains(evt.target);
                            })[0];

                            if (target) {
                                if (stopPropagation) {
                                    evt.stopPropagation();
                                }

                                if (preventDefault) {
                                    evt.preventDefault();
                                }

                                invoke(el, evt, target);
                            }
                        } else {
                            if (stopPropagation) {
                                evt.stopPropagation();
                            }

                            if (preventDefault) {
                                evt.preventDefault();
                            }

                            invoke(el, evt, el);
                        }
                    };

                    el.__cebOnHandlers = events.map(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2);

                        var name = _ref2[0];
                        var target = _ref2[1];
                        return [name, target ? el.querySelector(target) : el];
                    }).filter(function (_ref3) {
                        var _ref4 = _slicedToArray(_ref3, 2);

                        var name = _ref4[0];
                        var target = _ref4[1];
                        return !!target;
                    }).map(function (_ref5) {
                        var _ref6 = _slicedToArray(_ref5, 2);

                        var name = _ref6[0];
                        var target = _ref6[1];
                        target.addEventListener(name, listener, capture);
                        return [target, name, listener, capture];
                    });

                    el.__cebOnHandlers.forEach(function (_ref7) {
                        var _ref8 = _slicedToArray(_ref7, 4);

                        var target = _ref8[0];
                        var name = _ref8[1];
                        var listener = _ref8[2];
                        var capture = _ref8[3];
                        return target.addEventListener(name, listener, capture);
                    });
                });
                on('before:detachedCallback').invoke(function (el) {
                    el.__cebOnHandlers.forEach(function (_ref9) {
                        var _ref10 = _slicedToArray(_ref9, 4);

                        var target = _ref10[0];
                        var name = _ref10[1];
                        var listener = _ref10[2];
                        var capture = _ref10[3];
                        return target.removeEventListener(name, listener, capture);
                    });
                });
            }
        }]);

        return OnBuilder;
    })();

    function on(events) {
        return new OnBuilder(events);
    }
});