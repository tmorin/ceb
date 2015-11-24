'use strict';

System.register(['babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js'], function (_export) {
    var _Object$getPrototypeOf, _classCallCheck, _createClass, _possibleConstructorReturn, _inherits, isFunction, toArray, partial, bind, Builder, MethodBuilder;

    return {
        setters: [function (_babelRuntimeCoreJsObjectGetPrototypeOf) {
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
            partial = _utilsJs.partial;
            bind = _utilsJs.bind;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }],
        execute: function () {
            _export('MethodBuilder', MethodBuilder = (function (_Builder) {
                _inherits(MethodBuilder, _Builder);

                function MethodBuilder(methName) {
                    _classCallCheck(this, MethodBuilder);

                    var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(MethodBuilder).call(this));

                    _this.data = {
                        methName: methName,
                        wrappers: []
                    };
                    return _this;
                }

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
                    key: 'build',
                    value: function build(proto, on) {
                        var data = this.data;

                        if (data.invoke) {
                            proto[data.methName] = function () {
                                return data.invoke.apply(this, [this].concat(toArray(arguments)));
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
                                            args.shift();
                                            original.apply(el, args);
                                        };

                                        el[data.methName] = data.wrappers.reduce(function (next, current, index) {
                                            if (index === lastIndex) {
                                                return bind(partial(current, next, el), el);
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
            })(Builder));

            _export('MethodBuilder', MethodBuilder);
        }
    };
});