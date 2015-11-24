'use strict';

define(['exports', 'babel-runtime/core-js/object/define-property', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', './Builder.js', '../utils.js'], function (exports, _defineProperty, _getPrototypeOf, _classCallCheck2, _createClass2, _possibleConstructorReturn2, _inherits2, _Builder2, _utils) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PropertyBuilder = undefined;

    var _defineProperty2 = _interopRequireDefault(_defineProperty);

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

    var DEFAULT_DATA = {
        enumerable: true,
        immutable: false,
        descriptorValue: true
    };

    var PropertyBuilder = (function (_Builder) {
        (0, _inherits3.default)(PropertyBuilder, _Builder);

        function PropertyBuilder(propName) {
            (0, _classCallCheck3.default)(this, PropertyBuilder);

            var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(PropertyBuilder).call(this));

            _this.data = (0, _utils.assign)({
                propName: propName
            }, DEFAULT_DATA);
            return _this;
        }

        (0, _createClass3.default)(PropertyBuilder, [{
            key: 'immutable',
            value: function immutable() {
                this.data.immutable = true;
                return this;
            }
        }, {
            key: 'hidden',
            value: function hidden() {
                this.data.enumerable = false;
                return this;
            }
        }, {
            key: 'value',
            value: function value(_value) {
                this.data.value = _value;
                return this;
            }
        }, {
            key: 'getter',
            value: function getter(fn) {
                this.data.descriptorValue = false;
                this.data.getter = fn;
                return this;
            }
        }, {
            key: 'setter',
            value: function setter(fn) {
                this.data.descriptorValue = false;
                this.data.setter = fn;
                return this;
            }
        }, {
            key: 'build',
            value: function build(proto, on) {
                var _this2 = this;

                var data = this.data,
                    defaultValue = (0, _utils.result)(this.data, 'value'),
                    descriptor = {
                    enumerable: this.data.enumerable
                };

                if (this.data.immutable) {
                    descriptor.configurable = false;
                    descriptor.writable = false;
                } else if ((0, _utils.isFunction)(this.data.getter) || (0, _utils.isFunction)(this.data.setter)) {
                    descriptor.configurable = false;

                    descriptor.get = function () {
                        return data.getter.call(this, this);
                    };

                    descriptor.set = function (value) {
                        return data.setter.call(this, this, value);
                    };
                } else {
                    descriptor.configurable = true;
                    descriptor.writable = true;
                }

                if (this.data.descriptorValue) {
                    descriptor.value = defaultValue;
                }

                (0, _defineProperty2.default)(proto, this.data.propName, descriptor);
                on('after:createdCallback').invoke(function (el) {
                    if (!_this2.data.descriptorValue && !(0, _utils.isUndefined)(defaultValue)) {
                        el[data.propName] = defaultValue;
                    }
                });
            }
        }]);
        return PropertyBuilder;
    })(_Builder2.Builder);

    exports.PropertyBuilder = PropertyBuilder;
});