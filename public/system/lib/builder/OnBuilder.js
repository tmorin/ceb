System.register(['lodash/lang/isFunction.js', 'lodash/lang/toArray.js', 'lodash/collection/find.js', 'lodash/utility/noop.js', './Builder.js'], function (_export) {

    /**
     * The on builder.
     * Its goal is to provide a way to listen events coming from the custom element.
     * @extends {Builder}
     */
    'use strict';

    var isFunction, toArray, find, noop, Builder, OnBuilder;

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    _export('default', helper);

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    /**
     * @ignore
     */

    function helper(tpl) {
        return new OnBuilder(tpl);
    }

    return {
        setters: [function (_lodashLangIsFunctionJs) {
            isFunction = _lodashLangIsFunctionJs['default'];
        }, function (_lodashLangToArrayJs) {
            toArray = _lodashLangToArrayJs['default'];
        }, function (_lodashCollectionFindJs) {
            find = _lodashCollectionFindJs['default'];
        }, function (_lodashUtilityNoopJs) {
            noop = _lodashUtilityNoopJs['default'];
        }, function (_BuilderJs) {
            Builder = _BuilderJs['default'];
        }],
        execute: function () {
            OnBuilder = (function (_Builder) {
                _inherits(OnBuilder, _Builder);

                /**
                 * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
                 */

                function OnBuilder(events) {
                    _classCallCheck(this, OnBuilder);

                    _get(Object.getPrototypeOf(OnBuilder.prototype), 'constructor', this).call(this);
                    /**
                     * @ignore
                     */
                    this.data = { events: events, invoke: noop };
                }

                /**
                 * To do something when events occurred.
                 * The target arugment is by default the custom element.
                 * When the delegate feature is used, target is the matched element.
                 * @param {!function(el: HTMLElement, evt: DOMEvent, target: HTMLElement)} fn the event's logic
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

                    /**
                     * To attach the event on the capture phase instread of on the bubble phase.
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
                                if (stopPropagation) {
                                    evt.stopPropagation();
                                }
                                if (preventDefault) {
                                    evt.preventDefault();
                                }

                                if (selector) {
                                    var target = find(toArray(el.querySelectorAll(selector)), function (el) {
                                        return el === evt.target || el.contains(evt.target);
                                    });
                                    if (target) {
                                        invoke(el, evt, target);
                                    }
                                } else {
                                    invoke(el, evt, el);
                                }
                            };

                            el._cebOnHandlers = events.map(function (_ref) {
                                var _ref2 = _slicedToArray(_ref, 2);

                                var name = _ref2[0];
                                var target = _ref2[1];
                                return [name, target ? el.querySelector(target) : el];
                            }).filter(function (_ref3) {
                                var _ref32 = _slicedToArray(_ref3, 2);

                                var name = _ref32[0];
                                var target = _ref32[1];
                                return !!target;
                            }).map(function (_ref4) {
                                var _ref42 = _slicedToArray(_ref4, 2);

                                var name = _ref42[0];
                                var target = _ref42[1];

                                target.addEventListener(name, listener, capture);
                                return [target, name, listener, capture];
                            });

                            el._cebOnHandlers.forEach(function (_ref5) {
                                var _ref52 = _slicedToArray(_ref5, 4);

                                var target = _ref52[0];
                                var name = _ref52[1];
                                var listener = _ref52[2];
                                var capture = _ref52[3];
                                return target.addEventListener(name, listener, capture);
                            });
                        });

                        on('before:detachedCallback').invoke(function (el) {
                            el._cebOnHandlers.forEach(function (_ref6) {
                                var _ref62 = _slicedToArray(_ref6, 4);

                                var target = _ref62[0];
                                var name = _ref62[1];
                                var listener = _ref62[2];
                                var capture = _ref62[3];
                                return target.removeEventListener(name, listener, capture);
                            });
                        });
                    }
                }]);

                return OnBuilder;
            })(Builder);

            _export('OnBuilder', OnBuilder);
        }
    };
});