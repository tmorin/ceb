'use strict';

System.register(['babel-runtime/helpers/slicedToArray', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js'], function (_export) {
    var _slicedToArray, _Object$getPrototypeOf, _classCallCheck, _createClass, _possibleConstructorReturn, _inherits, isFunction, toArray, find, noop, Builder, OnBuilder;

    return {
        setters: [function (_babelRuntimeHelpersSlicedToArray) {
            _slicedToArray = _babelRuntimeHelpersSlicedToArray.default;
        }, function (_babelRuntimeCoreJsObjectGetPrototypeOf) {
            _Object$getPrototypeOf = _babelRuntimeCoreJsObjectGetPrototypeOf.default;
        }, function (_babelRuntimeHelpersClassCallCheck) {
            _classCallCheck = _babelRuntimeHelpersClassCallCheck.default;
        }, function (_babelRuntimeHelpersCreateClass) {
            _createClass = _babelRuntimeHelpersCreateClass.default;
        }, function (_babelRuntimeHelpersPossibleConstructorReturn) {
            _possibleConstructorReturn = _babelRuntimeHelpersPossibleConstructorReturn.default;
        }, function (_babelRuntimeHelpersInherits) {
            _inherits = _babelRuntimeHelpersInherits.default;
        }, function (_utilsJs) {
            isFunction = _utilsJs.isFunction;
            toArray = _utilsJs.toArray;
            find = _utilsJs.find;
            noop = _utilsJs.noop;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }],
        execute: function () {
            _export('OnBuilder', OnBuilder = (function (_Builder) {
                _inherits(OnBuilder, _Builder);

                function OnBuilder(events) {
                    _classCallCheck(this, OnBuilder);

                    var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(OnBuilder).call(this));

                    _this.data = {
                        events: events,
                        invoke: noop
                    };
                    return _this;
                }

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
                            el._cebOnHandlers = [];
                        });
                        on('before:attachedCallback').invoke(function (el) {
                            var listener = function listener(evt) {
                                if (selector) {
                                    var target = find(toArray(el.querySelectorAll(selector)), function (el) {
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

                            el._cebOnHandlers.forEach(function (_ref7) {
                                var _ref8 = _slicedToArray(_ref7, 4);

                                var target = _ref8[0];
                                var name = _ref8[1];
                                var listener = _ref8[2];
                                var capture = _ref8[3];
                                return target.addEventListener(name, listener, capture);
                            });
                        });
                        on('before:detachedCallback').invoke(function (el) {
                            el._cebOnHandlers.forEach(function (_ref9) {
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
            })(Builder));

            _export('OnBuilder', OnBuilder);
        }
    };
});