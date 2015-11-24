'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('../utils.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.getPrototypeOf, global.classCallCheck, global.createClass, global.possibleConstructorReturn, global.inherits, global.utils, global.Builder);
        global.MethodBuilder = mod.exports;
    }
})(this, function (exports, _getPrototypeOf, _classCallCheck2, _createClass2, _possibleConstructorReturn2, _inherits2, _utils, _Builder2) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.MethodBuilder = undefined;

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

    var MethodBuilder = exports.MethodBuilder = (function (_Builder) {
        (0, _inherits3.default)(MethodBuilder, _Builder);

        /**
         * @param {!string} methName the name of the method
         */

        function MethodBuilder(methName) {
            (0, _classCallCheck3.default)(this, MethodBuilder);

            /**
             * @ignore
             */

            var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MethodBuilder).call(this));

            _this.data = { methName: methName, wrappers: [] };
            return _this;
        }

        /**
         * To do something when invoked.
         * @param {!function(el: HTMLElement, args: ...*)} fn the method's logic
         * @returns {MethodBuilder} the builder
         */

        (0, _createClass3.default)(MethodBuilder, [{
            key: 'invoke',
            value: function invoke(fn) {
                if ((0, _utils.isFunction)(fn)) {
                    this.data.invoke = fn;
                }
                return this;
            }

            /**
             * To do something around the invocation.
             * @param {...function(el: HTMLElement, args: ...*)} wrappers a set of wrappers
             * @returns {MethodBuilder} the builder
             */

        }, {
            key: 'wrap',
            value: function wrap() {
                for (var _len = arguments.length, wrappers = Array(_len), _key = 0; _key < _len; _key++) {
                    wrappers[_key] = arguments[_key];
                }

                this.data.wrappers = this.data.wrappers.concat(wrappers);
                return this;
            }

            /**
             * @override
             */

        }, {
            key: 'build',
            value: function build(proto, on) {
                var data = this.data;

                if (data.invoke) {
                    proto[data.methName] = function () {
                        return data.invoke.apply(this, [this].concat((0, _utils.toArray)(arguments)));
                    };
                }

                if (data.wrappers.length) {
                    on('before:createdCallback').invoke(function (el) {
                        if ((0, _utils.isFunction)(el[data.methName])) {
                            (function () {
                                var lastIndex = data.wrappers.length - 1,
                                    original = el[data.methName],
                                    target = function target() {
                                    var args = (0, _utils.toArray)(arguments);
                                    args.shift();
                                    original.apply(el, args);
                                };
                                el[data.methName] = data.wrappers.reduce(function (next, current, index) {
                                    if (index === lastIndex) {
                                        return (0, _utils.bind)((0, _utils.partial)(current, next, el), el);
                                    }
                                    return (0, _utils.bind)((0, _utils.partial)(current, next), el);
                                }, target);
                            })();
                        }
                    });
                }
            }
        }]);
        return MethodBuilder;
    })(_Builder2.Builder);
});