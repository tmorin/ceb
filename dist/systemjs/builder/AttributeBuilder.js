'use strict';

System.register(['babel-runtime/core-js/object/define-property', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', '../utils.js', './Builder.js'], function (_export) {
    var _Object$defineProperty, _Object$getPrototypeOf, _classCallCheck, _createClass, _possibleConstructorReturn, _inherits, camelCase, isFunction, isUndefined, result, isNull, assign, Builder, DEFAULT_DATA, AttributeBuilder;

    function getterFactory(attrName, isBoolean) {
        return function () {
            return getAttValue(this, attrName, isBoolean);
        };
    }

    function setterFactory(attrName, isBoolean, attSetter) {
        return function (value) {
            var attValue = isFunction(attSetter) ? attSetter.call(this, this, value) : value;
            return setAttValue(this, attrName, isBoolean, attValue);
        };
    }

    return {
        setters: [function (_babelRuntimeCoreJsObjectDefineProperty) {
            _Object$defineProperty = _babelRuntimeCoreJsObjectDefineProperty.default;
        }, function (_babelRuntimeCoreJsObjectGetPrototypeOf) {
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
            camelCase = _utilsJs.camelCase;
            isFunction = _utilsJs.isFunction;
            isUndefined = _utilsJs.isUndefined;
            result = _utilsJs.result;
            isNull = _utilsJs.isNull;
            assign = _utilsJs.assign;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }],
        execute: function () {
            function getAttValue(el, attrName, isBoolean) {
                if (isBoolean) {
                    return el.hasAttribute(attrName);
                }

                return el.getAttribute(attrName);
            }

            _export('getAttValue', getAttValue);

            function setAttValue(el, attrName, isBoolean, value) {
                if (isBoolean) {
                    if (value && !el.hasAttribute(attrName)) {
                        el.setAttribute(attrName, '');
                    } else if (!value && el.hasAttribute(attrName)) {
                        el.removeAttribute(attrName);
                    }
                } else {
                    if ((isUndefined(value) || isNull(value)) && el.hasAttribute(attrName)) {
                        el.removeAttribute(attrName);
                    } else if (!isUndefined(value) && !isNull(value) && el.getAttribute(attrName) !== value) {
                        el.setAttribute(attrName, value);
                    }
                }
            }

            _export('setAttValue', setAttValue);

            DEFAULT_DATA = {
                bound: true,
                getterFactory: getterFactory,
                setterFactory: setterFactory,
                getAttValue: getAttValue,
                setAttValue: setAttValue
            };

            _export('AttributeBuilder', AttributeBuilder = (function (_Builder) {
                _inherits(AttributeBuilder, _Builder);

                function AttributeBuilder(attrName) {
                    _classCallCheck(this, AttributeBuilder);

                    var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(AttributeBuilder).call(this));

                    _this.data = assign({
                        attrName: attrName,
                        propName: camelCase(attrName),
                        listeners: []
                    }, DEFAULT_DATA);
                    return _this;
                }

                _createClass(AttributeBuilder, [{
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

                        var defaultValue = result(this.data, 'value'),
                            descriptor = {
                            enumerable: this.data.enumerable,
                            configurable: false,
                            get: this.data.getterFactory(this.data.attrName, this.data.boolean),
                            set: this.data.setterFactory(this.data.attrName, this.data.boolean)
                        };

                        if (this.data.bound) {
                            _Object$defineProperty(proto, this.data.propName, descriptor);
                        }

                        on('after:createdCallback').invoke(function (el) {
                            if (_this2.data.bound) {
                                var attrValue = getAttValue(el, _this2.data.attrName, _this2.data.boolean);

                                if (_this2.data.boolean) {
                                    el[_this2.data.propName] = !!defaultValue ? defaultValue : attrValue;
                                } else if (!isNull(attrValue) && !isUndefined(attrValue)) {
                                    el[_this2.data.propName] = attrValue;
                                } else if (!isUndefined(defaultValue)) {
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
            })(Builder));

            _export('AttributeBuilder', AttributeBuilder);
        }
    };
});