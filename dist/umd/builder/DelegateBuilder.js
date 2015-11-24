'use strict';

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './AttributeBuilder.js', './Builder.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('babel-runtime/core-js/object/get-prototype-of'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/helpers/possibleConstructorReturn'), require('babel-runtime/helpers/inherits'), require('../utils.js'), require('./AttributeBuilder.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.getPrototypeOf, global.classCallCheck, global.createClass, global.possibleConstructorReturn, global.inherits, global.utils, global.AttributeBuilder, global.Builder);
        global.DelegateBuilder = mod.exports;
    }
})(this, function (exports, _getPrototypeOf, _classCallCheck2, _createClass2, _possibleConstructorReturn2, _inherits2, _utils, _AttributeBuilder, _Builder2) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DelegateBuilder = undefined;

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

    var DelegateBuilder = exports.DelegateBuilder = (function (_Builder) {
        (0, _inherits3.default)(DelegateBuilder, _Builder);

        /**
         * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} fieldBuilder the field builder
         */

        function DelegateBuilder(fieldBuilder) {
            (0, _classCallCheck3.default)(this, DelegateBuilder);

            /**
             * @ignore
             */

            var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DelegateBuilder).call(this));

            _this.fieldBuilder = fieldBuilder;
            /**
             * @ignore
             */
            _this.data = {};
            if (fieldBuilder.data.attrName) {
                _this.data.attrName = fieldBuilder.data.attrName;
            } else if (_this.fieldBuilder.data.propName) {
                _this.data.propName = fieldBuilder.data.propName;
            } else if (_this.fieldBuilder.data.methName) {
                _this.data.methName = fieldBuilder.data.methName;
            }
            return _this;
        }

        /**
         * The target of the delegate.
         * @param {!string} selector a valid css query
         * @returns {DelegateBuilder} the builder
         */

        (0, _createClass3.default)(DelegateBuilder, [{
            key: 'to',
            value: function to(selector) {
                this.data.selector = selector;
                return this;
            }

            /**
             * To force the delegation to a property.
             * @param {string} [propName] the name of the property
             * @returns {DelegateBuilder} the builder
             */

        }, {
            key: 'property',
            value: function property(propName) {
                this.data.attrName = null;
                if (!(0, _utils.isUndefined)(propName)) {
                    this.data.propName = propName;
                } else {
                    this.data.propName = this.fieldBuilder.data.propName;
                }
                return this;
            }

            /**
             * To force the delegation to an attribute.
             * @param {string} [attrName] the name of the attribute
             * @returns {DelegateBuilder} the builder
             */

        }, {
            key: 'attribute',
            value: function attribute(attrName) {
                this.data.propName = null;
                if (!(0, _utils.isUndefined)(attrName)) {
                    this.data.attrName = attrName;
                } else {
                    this.data.attrName = this.fieldBuilder.data.attrName || this.fieldBuilder.data.propName;
                }
                return this;
            }

            /**
             * To force the delegation to a method.
             * @param {string} [methName] the name of the method
             * @returns {DelegateBuilder} the builder
             */

        }, {
            key: 'method',
            value: function method(methName) {
                this.data.methName = null;
                if (!(0, _utils.isUndefined)(methName)) {
                    this.data.methName = methName;
                } else {
                    this.data.methName = this.fieldBuilder.data.methName;
                }
                return this;
            }

            /**
             * @override
             */

        }, {
            key: 'build',
            value: function build(proto, on) {
                var data = this.data,
                    fieldBuilderData = this.fieldBuilder.data,
                    targetedPropName = this.data.propName,
                    targetedMethName = this.data.methName,
                    targetedAttrName = this.data.attrName,
                    fieldGetter = fieldBuilderData.getter,
                    fieldSetter = fieldBuilderData.setter;

                if (fieldBuilderData.attrName) {
                    fieldBuilderData.getterFactory = function (attrName, isBoolean) {
                        return function () {
                            var target = this.querySelector(data.selector);
                            if (target) {
                                return targetedAttrName ? (0, _AttributeBuilder.getAttValue)(target, targetedAttrName, isBoolean) : target[targetedPropName];
                            }
                        };
                    };
                    fieldBuilderData.setterFactory = function (attrName, isBoolean) {
                        return function (value) {
                            var target = this.querySelector(data.selector),
                                attrValue = value;
                            if (target) {
                                if (targetedAttrName) {
                                    (0, _AttributeBuilder.setAttValue)(target, targetedAttrName, isBoolean, attrValue);
                                } else {
                                    target[targetedPropName] = attrValue;
                                }
                                (0, _AttributeBuilder.setAttValue)(this, attrName, isBoolean, attrValue);
                            }
                        };
                    };
                } else if (fieldBuilderData.propName) {
                    fieldBuilderData.descriptorValue = false;
                    fieldBuilderData.getter = function (el) {
                        var target = el.querySelector(data.selector),
                            targetValue = undefined;
                        if (target) {
                            if (targetedAttrName) {
                                targetValue = target.getAttribute(targetedAttrName);
                            } else {
                                targetValue = target[targetedPropName];
                            }
                        }
                        return (0, _utils.isFunction)(fieldGetter) ? fieldGetter.call(el, el, targetValue) : targetValue;
                    };
                    fieldBuilderData.setter = function (el, value) {
                        var target = el.querySelector(data.selector),
                            targetValue = (0, _utils.isFunction)(fieldSetter) ? fieldSetter.call(el, el, value) : value;
                        if (target) {
                            if (targetedAttrName) {
                                target.setAttribute(targetedAttrName, targetValue);
                            } else {
                                target[targetedPropName] = targetValue;
                            }
                        }
                    };
                } else if (fieldBuilderData.methName) {
                    fieldBuilderData.invoke = function (el) {
                        var target = el.querySelector(data.selector);
                        if ((0, _utils.isFunction)(target[targetedMethName])) {
                            var args = (0, _utils.toArray)(arguments);
                            args.shift();
                            return target[targetedMethName].apply(target, args);
                        }
                    };
                }

                this.fieldBuilder.build(proto, on);
            }
        }]);
        return DelegateBuilder;
    })(_Builder2.Builder);
});