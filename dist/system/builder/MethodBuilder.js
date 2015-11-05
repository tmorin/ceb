'use strict';

System.register(['../utils.js', './Builder.js'], function (_export) {
    var isFunction, toArray, partial, bind, Builder, _createClass, MethodBuilder;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    return {
        setters: [function (_utilsJs) {
            isFunction = _utilsJs.isFunction;
            toArray = _utilsJs.toArray;
            partial = _utilsJs.partial;
            bind = _utilsJs.bind;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }],
        execute: function () {
            _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _export('MethodBuilder', MethodBuilder = (function (_Builder) {
                _inherits(MethodBuilder, _Builder);

                function MethodBuilder(methName) {
                    _classCallCheck(this, MethodBuilder);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MethodBuilder).call(this));

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