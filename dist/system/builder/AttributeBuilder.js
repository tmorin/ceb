'use strict';

System.register(['../utils.js', './PropertyBuilder.js'], function (_export) {
    var camelCase, isFunction, isUndefined, result, isNull, assign, PropertyBuilder, _createClass, AttributeBuilder;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        setters: [function (_utilsJs) {
            camelCase = _utilsJs.camelCase;
            isFunction = _utilsJs.isFunction;
            isUndefined = _utilsJs.isUndefined;
            result = _utilsJs.result;
            isNull = _utilsJs.isNull;
            assign = _utilsJs.assign;
        }, function (_PropertyBuilderJs) {
            PropertyBuilder = _PropertyBuilderJs.PropertyBuilder;
        }],
        execute: function () {
            _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

            _export('AttributeBuilder', AttributeBuilder = (function (_PropertyBuilder) {
                _inherits(AttributeBuilder, _PropertyBuilder);

                function AttributeBuilder(attrName) {
                    _classCallCheck(this, AttributeBuilder);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AttributeBuilder).call(this, camelCase(attrName)));

                    assign(_this.data, {
                        attrName: attrName,
                        bound: true,
                        listeners: [],
                        getterFactory: getterFactory,
                        setterFactory: setterFactory,
                        descriptorValue: false,
                        getAttValue: getAttValue,
                        setAttValue: setAttValue
                    });
                    return _this;
                }

                _createClass(AttributeBuilder, [{
                    key: 'boolean',
                    value: function boolean() {
                        this.data.boolean = true;
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
                            Object.defineProperty(proto, this.data.propName, descriptor);
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
            })(PropertyBuilder));

            _export('AttributeBuilder', AttributeBuilder);
        }
    };
});