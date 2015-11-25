'use strict';

System.register(['../helper/type.js', '../helper/converter.js', './attribute.js'], function (_export) {
    var isUndefined, isFunction, toArray, getAttValue, setAttValue, _createClass, DelegateBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_helperTypeJs) {
            isUndefined = _helperTypeJs.isUndefined;
            isFunction = _helperTypeJs.isFunction;
        }, function (_helperConverterJs) {
            toArray = _helperConverterJs.toArray;
        }, function (_attributeJs) {
            getAttValue = _attributeJs.getAttValue;
            setAttValue = _attributeJs.setAttValue;
        }],
        execute: function () {
            _createClass = (function () {
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
            })();

            _export('DelegateBuilder', DelegateBuilder = (function () {
                function DelegateBuilder(fieldBuilder) {
                    _classCallCheck(this, DelegateBuilder);

                    this.fieldBuilder = fieldBuilder;
                    this.data = {};

                    if (fieldBuilder.data.attrName) {
                        this.data.attrName = fieldBuilder.data.attrName;
                    } else if (this.fieldBuilder.data.propName) {
                        this.data.propName = fieldBuilder.data.propName;
                    } else if (this.fieldBuilder.data.methName) {
                        this.data.methName = fieldBuilder.data.methName;
                    }
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
            })());

            _export('DelegateBuilder', DelegateBuilder);

            function delegate(builder) {
                return new DelegateBuilder(builder);
            }

            _export('delegate', delegate);
        }
    };
});