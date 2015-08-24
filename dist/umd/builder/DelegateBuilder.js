(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js', './AttributeBuilder.js', './Builder.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'), require('./AttributeBuilder.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils, global.AttributeBuilder, global.Builder);
        global.DelegateBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs, _AttributeBuilderJs, _BuilderJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    /**
     * The delegate builder.
     * Its goal is to provide a way to delegate properties and attributes.
     * @extends {Builder}
     */

    var DelegateBuilder = (function (_Builder) {
        _inherits(DelegateBuilder, _Builder);

        /**
         * @param {!PropertyBuilder|AttributeBuilder} fieldBuilder the field builder
         */

        function DelegateBuilder(fieldBuilder) {
            _classCallCheck(this, DelegateBuilder);

            _get(Object.getPrototypeOf(DelegateBuilder.prototype), 'constructor', this).call(this);
            /**
             * @ignore
             */
            this.fieldBuilder = fieldBuilder;
            /**
             * @ignore
             */
            this.data = {};
            if (fieldBuilder.data.attrName) {
                this.data.attrName = fieldBuilder.data.attrName;
            } else if (this.fieldBuilder.data.propName) {
                this.data.propName = fieldBuilder.data.propName;
            }
        }

        /**
         * The target of the delegate.
         * @param {!string} selector a valid css query
         * @returns {DelegateBuilder} the builder
         */

        _createClass(DelegateBuilder, [{
            key: 'to',
            value: function to(selector) {
                this.data.selector = selector;
                return this;
            }

            /**
             * To force a delegate to a property.
             * @param {string} [propName] the name of the property
             * @returns {DelegateBuilder} the builder
             */
        }, {
            key: 'property',
            value: function property(propName) {
                this.data.attrName = null;
                if (!(0, _utilsJs.isUndefined)(propName)) {
                    this.data.propName = propName;
                } else {
                    this.data.propName = this.fieldBuilder.data.propName;
                }
                return this;
            }

            /**
             * To force the delegate to an attribute.
             * @param {string} [attrName] the name of the attribute
             * @returns {DelegateBuilder} the builder
             */
        }, {
            key: 'attribute',
            value: function attribute(attrName) {
                this.data.propName = null;
                if (!(0, _utilsJs.isUndefined)(attrName)) {
                    this.data.attrName = attrName;
                } else {
                    this.data.attrName = this.fieldBuilder.data.attrName || this.fieldBuilder.data.propName;
                }
                return this;
            }

            /**
             * @override
             */
        }, {
            key: 'build',
            value: function build(proto, on) {
                var _this = this;

                var data = this.data,
                    fieldBuilderData = this.fieldBuilder.data,
                    targetedPropName = this.data.propName,
                    targetedAttrName = this.data.attrName,
                    fieldGetter = fieldBuilderData.getter,
                    fieldSetter = fieldBuilderData.setter;

                if (fieldBuilderData.attrName) {
                    fieldBuilderData.getterFactory = function (attrName, isBoolean) {
                        return function (el) {
                            var target = el.querySelector(data.selector);
                            if (target) {
                                return targetedAttrName ? (0, _AttributeBuilderJs.getAttValue)(target, targetedAttrName, isBoolean) : target[targetedPropName];
                            }
                        };
                    };
                    fieldBuilderData.setterFactory = function (attrName, isBoolean, attSetter) {
                        return function (el, value) {
                            var target = el.querySelector(data.selector),
                                attrValue = (0, _utilsJs.isFunction)(attSetter) ? attSetter.call(el, el, value) : value;
                            if (target) {
                                if (targetedAttrName) {
                                    (0, _AttributeBuilderJs.setAttValue)(target, targetedAttrName, isBoolean, attrValue);
                                } else {
                                    target[targetedPropName] = attrValue;
                                }
                                (0, _AttributeBuilderJs.setAttValue)(el, attrName, isBoolean, attrValue);
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
                        return (0, _utilsJs.isFunction)(fieldGetter) ? fieldGetter.call(_this, _this, targetValue) : targetValue;
                    };
                    fieldBuilderData.setter = function (el, value) {
                        var target = el.querySelector(data.selector),
                            targetValue = (0, _utilsJs.isFunction)(fieldSetter) ? fieldSetter.call(_this, _this, value) : value;
                        if (target) {
                            if (targetedAttrName) {
                                target.setAttribute(targetedAttrName, targetValue);
                            } else {
                                target[targetedPropName] = targetValue;
                            }
                        }
                    };
                }

                this.fieldBuilder.build(proto, on);
            }
        }]);

        return DelegateBuilder;
    })(_BuilderJs.Builder);

    exports.DelegateBuilder = DelegateBuilder;
});