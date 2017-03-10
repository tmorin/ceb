'use strict';

System.register(['../helper/types.js', '../helper/converters.js', './attribute.js', './Builder'], function (_export, _context) {
    "use strict";

    var isUndefined, isFunction, toArray, getAttValue, setAttValue, Builder, _createClass, DelegateBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    /**
     * Get a new delegate builder.
     * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} builder a property, attribute or method builder
     * @returns {DelegateBuilder} the delegate builder
     */
    function delegate(builder) {
        return new DelegateBuilder(builder);
    }

    _export('delegate', delegate);

    return {
        setters: [function (_helperTypesJs) {
            isUndefined = _helperTypesJs.isUndefined;
            isFunction = _helperTypesJs.isFunction;
        }, function (_helperConvertersJs) {
            toArray = _helperConvertersJs.toArray;
        }, function (_attributeJs) {
            getAttValue = _attributeJs.getAttValue;
            setAttValue = _attributeJs.setAttValue;
        }, function (_Builder2) {
            Builder = _Builder2.default;
        }],
        execute: function () {
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

            _export('DelegateBuilder', DelegateBuilder = function (_Builder) {
                _inherits(DelegateBuilder, _Builder);

                /**
                 * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} fieldBuilder the field builder
                 */
                function DelegateBuilder(fieldBuilder) {
                    _classCallCheck(this, DelegateBuilder);

                    var _this = _possibleConstructorReturn(this, (DelegateBuilder.__proto__ || Object.getPrototypeOf(DelegateBuilder)).call(this));

                    /**
                     * @ignore
                     */
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


                _createClass(DelegateBuilder, [{
                    key: 'to',
                    value: function to(selector) {
                        this.data.selector = selector;
                        return this;
                    }
                }, {
                    key: 'property',
                    value: function property(propName) {
                        this.data.attrName = null;
                        if (!isUndefined(propName)) {
                            this.data.propName = propName;
                        } else {
                            this.data.propName = this.fieldBuilder.data.propName;
                        }
                        return this;
                    }
                }, {
                    key: 'attribute',
                    value: function attribute(attrName) {
                        this.data.propName = null;
                        if (!isUndefined(attrName)) {
                            this.data.attrName = attrName;
                        } else {
                            this.data.attrName = this.fieldBuilder.data.attrName || this.fieldBuilder.data.propName;
                        }
                        return this;
                    }
                }, {
                    key: 'method',
                    value: function method(methName) {
                        this.data.methName = null;
                        if (!isUndefined(methName)) {
                            this.data.methName = methName;
                        } else {
                            this.data.methName = this.fieldBuilder.data.methName;
                        }
                        return this;
                    }
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
                                        return targetedAttrName ? getAttValue(target, targetedAttrName, isBoolean) : target[targetedPropName];
                                    }
                                };
                            };
                            fieldBuilderData.setterFactory = function (attrName, isBoolean) {
                                return function (value) {
                                    var target = this.querySelector(data.selector),
                                        attrValue = value;
                                    if (target) {
                                        if (targetedAttrName) {
                                            setAttValue(target, targetedAttrName, isBoolean, attrValue);
                                        } else {
                                            target[targetedPropName] = attrValue;
                                        }
                                        setAttValue(this, attrName, isBoolean, attrValue);
                                    }
                                };
                            };
                        } else if (fieldBuilderData.propName) {
                            fieldBuilderData.descriptorValue = false;
                            fieldBuilderData.getter = function (el) {
                                var target = el.querySelector(data.selector),
                                    targetValue = void 0;
                                if (target) {
                                    if (targetedAttrName) {
                                        targetValue = target.getAttribute(targetedAttrName);
                                    } else {
                                        targetValue = target[targetedPropName];
                                    }
                                }
                                return isFunction(fieldGetter) ? fieldGetter.call(el, el, targetValue) : targetValue;
                            };
                            fieldBuilderData.setter = function (el, value) {
                                var target = el.querySelector(data.selector),
                                    targetValue = isFunction(fieldSetter) ? fieldSetter.call(el, el, value) : value;
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
                                if (isFunction(target[targetedMethName])) {
                                    var args = toArray(arguments);
                                    if (!fieldBuilderData.native) {
                                        args.shift();
                                    }
                                    return target[targetedMethName].apply(target, args);
                                }
                            };
                        }

                        this.fieldBuilder.build(proto, on);
                    }
                }]);

                return DelegateBuilder;
            }(Builder));

            _export('DelegateBuilder', DelegateBuilder);
        }
    };
});