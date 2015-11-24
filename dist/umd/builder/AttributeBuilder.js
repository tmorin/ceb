'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'babel-runtime/core-js/object/define-property', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('babel-runtime/core-js/object/define-property'), require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('../utils.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.defineProperty, global.getPrototypeOf, global.classCallCheck, global.createClass, global.possibleConstructorReturn, global.inherits, global.utils, global.Builder);
        global.AttributeBuilder = mod.exports;
    }
})(this, function (exports, _defineProperty, _getPrototypeOf, _classCallCheck2, _createClass2, _possibleConstructorReturn2, _inherits2, _utils, _Builder2) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AttributeBuilder = undefined;
    exports.getAttValue = getAttValue;
    exports.setAttValue = setAttValue;

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

    function getAttValue(el, attrName, isBoolean) {
        if (isBoolean) {
            return el.hasAttribute(attrName);
        }

        return el.getAttribute(attrName);
    }

    function setAttValue(el, attrName, isBoolean, value) {
        if (isBoolean) {
            if (value && !el.hasAttribute(attrName)) {
                el.setAttribute(attrName, '');
            } else if (!value && el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
            }
        } else {
            if (((0, _utils.isUndefined)(value) || (0, _utils.isNull)(value)) && el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
            } else if (!(0, _utils.isUndefined)(value) && !(0, _utils.isNull)(value) && el.getAttribute(attrName) !== value) {
                el.setAttribute(attrName, value);
            }
        }
    }

    function getterFactory(attrName, isBoolean) {
        return function () {
            return getAttValue(this, attrName, isBoolean);
        };
    }

    function setterFactory(attrName, isBoolean, attSetter) {
        return function (value) {
            var attValue = (0, _utils.isFunction)(attSetter) ? attSetter.call(this, this, value) : value;
            return setAttValue(this, attrName, isBoolean, attValue);
        };
    }

    var DEFAULT_DATA = {
        bound: true,
        getterFactory: getterFactory,
        setterFactory: setterFactory,
        getAttValue: getAttValue,
        setAttValue: setAttValue
    };

    var AttributeBuilder = (function (_Builder) {
        (0, _inherits3.default)(AttributeBuilder, _Builder);

        function AttributeBuilder(attrName) {
            (0, _classCallCheck3.default)(this, AttributeBuilder);

            var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AttributeBuilder).call(this));

            _this.data = (0, _utils.assign)({
                attrName: attrName,
                propName: (0, _utils.camelCase)(attrName),
                listeners: []
            }, DEFAULT_DATA);
            return _this;
        }

        (0, _createClass3.default)(AttributeBuilder, [{
            key: 'boolean',
            value: function boolean() {
                this.data.boolean = true;
                return this;
            }
        }, {
            key: 'hidden',
            value: function hidden() {
                this.data.enumerable = false;
                return this;
            }
        }, {
            key: 'unbound',
            value: function unbound() {
                this.data.bound = false;
                return this;
            }
        }, {
            key: 'property',
            value: function property(propName) {
                this.data.propName = propName;
                return this;
            }
        }, {
            key: 'value',
            value: function value(_value) {
                this.data.value = _value;
                return this;
            }
        }, {
            key: 'listen',
            value: function listen(listener) {
                this.data.listeners.push(listener);
                return this;
            }
        }, {
            key: 'build',
            value: function build(proto, on) {
                var _this2 = this;

                var defaultValue = (0, _utils.result)(this.data, 'value'),
                    descriptor = {
                    enumerable: this.data.enumerable,
                    configurable: false,
                    get: this.data.getterFactory(this.data.attrName, this.data.boolean),
                    set: this.data.setterFactory(this.data.attrName, this.data.boolean)
                };

                if (this.data.bound) {
                    (0, _defineProperty2.default)(proto, this.data.propName, descriptor);
                }

                on('after:createdCallback').invoke(function (el) {
                    if (_this2.data.bound) {
                        var attrValue = getAttValue(el, _this2.data.attrName, _this2.data.boolean);

                        if (_this2.data.boolean) {
                            el[_this2.data.propName] = !!defaultValue ? defaultValue : attrValue;
                        } else if (!(0, _utils.isNull)(attrValue) && !(0, _utils.isUndefined)(attrValue)) {
                            el[_this2.data.propName] = attrValue;
                        } else if (!(0, _utils.isUndefined)(defaultValue)) {
                            el[_this2.data.propName] = defaultValue;
                        }
                    }

                    if (_this2.data.listeners.length > 0) {
                        (function () {
                            var oldValue = _this2.data.boolean ? false : null;
                            var setValue = el[_this2.data.propName];

                            if (oldValue !== setValue) {
                                _this2.data.listeners.forEach(function (listener) {
                                    return listener.call(el, el, oldValue, setValue);
                                });
                            }
                        })();
                    }
                });
                on('before:attributeChangedCallback').invoke(function (el, attName, oldVal, newVal) {
                    if (attName === _this2.data.attrName) {
                        if (_this2.data.bound) {
                            var newValue = _this2.data.boolean ? newVal === '' : newVal;

                            if (el[_this2.data.propName] !== newValue) {
                                el[_this2.data.propName] = newValue;
                            }
                        }

                        if (_this2.data.listeners.length > 0) {
                            (function () {
                                var oldValue = _this2.data.boolean ? oldVal === '' : oldVal;
                                var setValue = _this2.data.boolean ? newVal === '' : newVal;

                                if (oldValue !== setValue) {
                                    _this2.data.listeners.forEach(function (listener) {
                                        return listener.call(el, el, oldValue, setValue);
                                    });
                                }
                            })();
                        }
                    }
                });
            }
        }]);
        return AttributeBuilder;
    })(_Builder2.Builder);

    exports.AttributeBuilder = AttributeBuilder;
});