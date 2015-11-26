'use strict';

System.register(['../helper/types.js', '../helper/objects.js', '../helper/converters.js'], function (_export) {
    var isFunction, isUndefined, isNull, result, assign, toCamelCase, _createClass, DEFAULT_DATA, AttributeBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

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
        setters: [function (_helperTypesJs) {
            isFunction = _helperTypesJs.isFunction;
            isUndefined = _helperTypesJs.isUndefined;
            isNull = _helperTypesJs.isNull;
        }, function (_helperObjectsJs) {
            result = _helperObjectsJs.result;
            assign = _helperObjectsJs.assign;
        }, function (_helperConvertersJs) {
            toCamelCase = _helperConvertersJs.toCamelCase;
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

            _export('AttributeBuilder', AttributeBuilder = (function () {
                function AttributeBuilder(attrName) {
                    _classCallCheck(this, AttributeBuilder);

                    this.data = assign({
                        attrName: attrName,
                        propName: toCamelCase(attrName),
                        listeners: []
                    }, DEFAULT_DATA);
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
                        var _this = this;

                        var defaultValue = result(this.data, 'value'),
                            descriptor = {
                            enumerable: this.data.enumerable,
                            configurable: false,
                            get: this.data.getterFactory(this.data.attrName, this.data.boolean),
                            set: this.data.setterFactory(this.data.attrName, this.data.boolean)
                        };

                        if (this.data.bound) {
                            Object.defineProperty(proto, this.data.propName, descriptor);
                        }

                        on('after:createdCallback').invoke(function (el) {
                            if (_this.data.bound) {
                                var attrValue = getAttValue(el, _this.data.attrName, _this.data.boolean);

                                if (_this.data.boolean) {
                                    el[_this.data.propName] = !!defaultValue ? defaultValue : attrValue;
                                } else if (!isNull(attrValue) && !isUndefined(attrValue)) {
                                    el[_this.data.propName] = attrValue;
                                } else if (!isUndefined(defaultValue)) {
                                    el[_this.data.propName] = defaultValue;
                                }
                            }

                            if (_this.data.listeners.length > 0) {
                                (function () {
                                    var oldValue = _this.data.boolean ? false : null;
                                    var setValue = el[_this.data.propName];

                                    if (oldValue !== setValue) {
                                        _this.data.listeners.forEach(function (listener) {
                                            return listener.call(el, el, oldValue, setValue);
                                        });
                                    }
                                })();
                            }
                        });
                        on('before:attributeChangedCallback').invoke(function (el, attName, oldVal, newVal) {
                            if (attName === _this.data.attrName) {
                                if (_this.data.bound) {
                                    var newValue = _this.data.boolean ? newVal === '' : newVal;

                                    if (el[_this.data.propName] !== newValue) {
                                        el[_this.data.propName] = newValue;
                                    }
                                }

                                if (_this.data.listeners.length > 0) {
                                    (function () {
                                        var oldValue = _this.data.boolean ? oldVal === '' : oldVal;
                                        var setValue = _this.data.boolean ? newVal === '' : newVal;

                                        if (oldValue !== setValue) {
                                            _this.data.listeners.forEach(function (listener) {
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
            })());

            _export('AttributeBuilder', AttributeBuilder);

            function attribute(attrName) {
                return new AttributeBuilder(attrName);
            }

            _export('attribute', attribute);
        }
    };
});