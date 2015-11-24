'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'babel-runtime/helpers/slicedToArray', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('babel-runtime/helpers/slicedToArray'), require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('../utils.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.slicedToArray, global.getPrototypeOf, global.classCallCheck, global.createClass, global.possibleConstructorReturn, global.inherits, global.utils, global.Builder);
        global.OnBuilder = mod.exports;
    }
})(this, function (exports, _slicedToArray2, _getPrototypeOf, _classCallCheck2, _createClass2, _possibleConstructorReturn2, _inherits2, _utils, _Builder2) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.OnBuilder = undefined;

    var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

    var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

    var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

    var _createClass3 = _interopRequireDefault(_createClass2);

    var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

    var _inherits3 = _interopRequireDefault(_inherits2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var OnBuilder = exports.OnBuilder = (function (_Builder) {
        (0, _inherits3.default)(OnBuilder, _Builder);

        /**
         * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
         */

        function OnBuilder(events) {
            (0, _classCallCheck3.default)(this, OnBuilder);

            /**
             * @ignore
             */

            var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(OnBuilder).call(this));

            _this.data = { events: events, invoke: _utils.noop };
            return _this;
        }

        /**
         * To do something when events occurred.
         * The target argument is by default the custom element.
         * When the delegate feature is used, target is the matched element.
         * @param {!function(el: HTMLElement, evt: DOMEvent, target: HTMLElement)} fn the event's logic
         * @returns {OnBuilder} the builder
         */

        (0, _createClass3.default)(OnBuilder, [{
            key: 'invoke',
            value: function invoke(fn) {
                if ((0, _utils.isFunction)(fn)) {
                    this.data.invoke = fn;
                }
                return this;
            }

            /**
             * To attach the event on the capture phase insteadof of on the bubble phase.
             * @returns {OnBuilder} the builder
             */

        }, {
            key: 'capture',
            value: function capture() {
                this.data.capture = true;
                return this;
            }

            /**
             * To delegate the event.
             * @param {!string} selector the selector
             * @returns {OnBuilder} the builder
             */

        }, {
            key: 'delegate',
            value: function delegate(selector) {
                this.data.selector = selector;
                return this;
            }

            /**
             * To prevent the default behavior.
             * @returns {OnBuilder} the builder
             */

        }, {
            key: 'prevent',
            value: function prevent() {
                this.data.preventDefault = true;
                return this;
            }

            /**
             * To stop the event propagation.
             * @returns {OnBuilder} the builder
             */

        }, {
            key: 'stop',
            value: function stop() {
                this.data.stopPropagation = true;
                return this;
            }

            /**
             * To prevent the default behavior and to stop the event propagation.
             * @returns {OnBuilder} the builder
             */

        }, {
            key: 'skip',
            value: function skip() {
                return this.prevent().stop();
            }

            /**
             * @ignore
             */

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
                    el._cebOnHandlers = [];
                });

                on('before:attachedCallback').invoke(function (el) {
                    var listener = function listener(evt) {
                        if (selector) {
                            var target = (0, _utils.find)((0, _utils.toArray)(el.querySelectorAll(selector)), function (el) {
                                return el === evt.target || el.contains(evt.target);
                            });
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

                    el._cebOnHandlers = events.map(function (_ref) {
                        var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

                        var name = _ref2[0];
                        var target = _ref2[1];
                        return [name, target ? el.querySelector(target) : el];
                    }).filter(function (_ref3) {
                        var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

                        var name = _ref4[0];
                        var target = _ref4[1];
                        return !!target;
                    }).map(function (_ref5) {
                        var _ref6 = (0, _slicedToArray3.default)(_ref5, 2);

                        var name = _ref6[0];
                        var target = _ref6[1];

                        target.addEventListener(name, listener, capture);
                        return [target, name, listener, capture];
                    });

                    el._cebOnHandlers.forEach(function (_ref7) {
                        var _ref8 = (0, _slicedToArray3.default)(_ref7, 4);

                        var target = _ref8[0];
                        var name = _ref8[1];
                        var listener = _ref8[2];
                        var capture = _ref8[3];
                        return target.addEventListener(name, listener, capture);
                    });
                });

                on('before:detachedCallback').invoke(function (el) {
                    el._cebOnHandlers.forEach(function (_ref9) {
                        var _ref10 = (0, _slicedToArray3.default)(_ref9, 4);

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
    })(_Builder2.Builder);
});