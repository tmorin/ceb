'use strict';

System.register(['babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './AttributeBuilder.js', './Builder.js'], function (_export) {
    var _Object$getPrototypeOf, _classCallCheck, _createClass, _possibleConstructorReturn, _inherits, isUndefined, isFunction, toArray, getAttValue, setAttValue, Builder, DelegateBuilder;

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
            isUndefined = _utilsJs.isUndefined;
            isFunction = _utilsJs.isFunction;
            toArray = _utilsJs.toArray;
        }, function (_AttributeBuilderJs) {
            getAttValue = _AttributeBuilderJs.getAttValue;
            setAttValue = _AttributeBuilderJs.setAttValue;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }],
        execute: function () {
            _export('DelegateBuilder', DelegateBuilder = (function (_Builder) {
                _inherits(DelegateBuilder, _Builder);

                function DelegateBuilder(fieldBuilder) {
                    _classCallCheck(this, DelegateBuilder);

                    var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(DelegateBuilder).call(this));

                    _this.fieldBuilder = fieldBuilder;
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
                                    targetValue = undefined;

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
                                    args.shift();
                                    return target[targetedMethName].apply(target, args);
                                }
                            };
                        }

                        this.fieldBuilder.build(proto, on);
                    }
                }]);

                return DelegateBuilder;
            })(Builder));

            _export('DelegateBuilder', DelegateBuilder);
        }
    };
});