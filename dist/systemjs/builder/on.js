'use strict';

System.register(['../helper/types.js', '../helper/functions.js', '../helper/converters.js'], function (_export, _context) {
    "use strict";

    var isFunction, noop, toArray, _slicedToArray, _createClass, OnBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    /**
     * Get a new on builder.
     * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
     * @returns {OnBuilder} the on builder
     */
    function on(events) {
        return new OnBuilder(events);
    }

    /**
     * Get a new on builder already setup with all mouse events: click, mousedown, mouseup, mouseover, mouseout, mousemove, contextmenu, dblclick.
     * @returns {OnBuilder}
     */

    _export('on', on);

    return {
        setters: [function (_helperTypesJs) {
            isFunction = _helperTypesJs.isFunction;
        }, function (_helperFunctionsJs) {
            noop = _helperFunctionsJs.noop;
        }, function (_helperConvertersJs) {
            toArray = _helperConvertersJs.toArray;
        }],
        execute: function () {
            _slicedToArray = function () {
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
            }();

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

            _export('OnBuilder', OnBuilder = function () {

                /**
                 * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
                 */
                function OnBuilder(events) {
                    _classCallCheck(this, OnBuilder);

                    /**
                     * @ignore
                     */
                    this.data = { events: events, invoke: noop };
                }

                /**
                 * To do something when events occurred.
                 * The target argument is by default the custom element.
                 * When the delegate feature is used, target is the matched element.
                 * @param {!function(el: HTMLElement, evt: Event, target: HTMLElement)} fn the event's logic
                 * @returns {OnBuilder} the builder
                 */


                _createClass(OnBuilder, [{
                    key: 'invoke',
                    value: function invoke(fn) {
                        if (isFunction(fn)) {
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
                            el.__cebOnHandlers = [];
                        });

                        on('before:attachedCallback').invoke(function (el) {
                            var listener = function listener(evt) {
                                if (selector) {
                                    var target = toArray(el.querySelectorAll(selector)).filter(function (el) {
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
                                var _ref2 = _slicedToArray(_ref, 2),
                                    name = _ref2[0],
                                    target = _ref2[1];

                                return [name, target ? el.querySelector(target) : el];
                            }).filter(function (_ref3) {
                                var _ref4 = _slicedToArray(_ref3, 2),
                                    name = _ref4[0],
                                    target = _ref4[1];

                                return !!target;
                            }).map(function (_ref5) {
                                var _ref6 = _slicedToArray(_ref5, 2),
                                    name = _ref6[0],
                                    target = _ref6[1];

                                return [target, name, listener, capture];
                            }).concat(el.__cebOnHandlers);

                            el.__cebOnHandlers.forEach(function (_ref7) {
                                var _ref8 = _slicedToArray(_ref7, 4),
                                    target = _ref8[0],
                                    name = _ref8[1],
                                    listener = _ref8[2],
                                    capture = _ref8[3];

                                return target.addEventListener(name, listener, capture);
                            });
                        });

                        on('before:detachedCallback').invoke(function (el) {
                            el.__cebOnHandlers.forEach(function (_ref9) {
                                var _ref10 = _slicedToArray(_ref9, 4),
                                    target = _ref10[0],
                                    name = _ref10[1],
                                    listener = _ref10[2],
                                    capture = _ref10[3];

                                return target.removeEventListener(name, listener, capture);
                            });
                            el.__cebOnHandlers = [];
                        });
                    }
                }]);

                return OnBuilder;
            }());

            _export('OnBuilder', OnBuilder);

            on.mouse = function () {
                return on('click, mousedown, mouseup, mouseover, mouseout, mousemove, contextmenu, dblclick');
            };

            /**
             * Get a new on builder already setup with all keyboard events: keydown, keypress, keyup.
             * @returns {OnBuilder}
             */
            on.keyboard = function () {
                return on('keydown, keypress, keyup');
            };
        }
    };
});