'use strict';

System.register(['../helper/types.js', '../helper/objects.js', '../helper/converters.js'], function (_export, _context) {
    "use strict";

    var isFunction, isUndefined, isNull, result, assign, toCamelCase, _createClass, DEFAULT_DATA, AttributeBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    /**
     * Get the value from an attribute.
     * @param {!HTMLElement} el an HTML element
     * @param {!string} attrName the name of the attribute
     * @param {!boolean} isBoolean true is the returned value should be a boolean
     * @returns {string|boolean}
     */
    function getAttValue(el, attrName, isBoolean) {
        if (isBoolean) {
            return el.hasAttribute(attrName);
        }
        return el.getAttribute(attrName);
    }

    /**
     * Set the value of an attribute.
     * @param {!HTMLElement} el an HTML element
     * @param {!string} attrName the name of the attribute
     * @param {!boolean} isBoolean true is the value should be a boolean
     * @param {string|boolean} value the value to set
     */

    _export('getAttValue', getAttValue);

    function setAttValue(el, attrName, isBoolean, value) {
        if (isBoolean) {
            // Handle boolean value
            if (value && !el.hasAttribute(attrName)) {
                el.setAttribute(attrName, '');
            } else if (!value && el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
            }
        } else {
            // Handle none boolean value
            if ((isUndefined(value) || isNull(value)) && el.hasAttribute(attrName)) {
                // There is no value, so the attribute must be removed
                el.removeAttribute(attrName);
            } else if (!isUndefined(value) && !isNull(value) && el.getAttribute(attrName) !== value) {
                // Sync the attribute value with value
                el.setAttribute(attrName, value);
            }
        }
    }

    _export('setAttValue', setAttValue);

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

    /**
     * Get a new attribute builder.
     * @param {!string} attrName the name of the attribute
     * @returns {AttributeBuilder} the attribute builder
     */
    function attribute(attrName) {
        return new AttributeBuilder(attrName);
    }

    _export('attribute', attribute);

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

            DEFAULT_DATA = {
                bound: true,
                getterFactory: getterFactory,
                setterFactory: setterFactory,
                getAttValue: getAttValue,
                setAttValue: setAttValue
            };

            _export('AttributeBuilder', AttributeBuilder = function () {

                /**
                 * @param {!string} attrName the name of the attribute
                 */
                function AttributeBuilder(attrName) {
                    _classCallCheck(this, AttributeBuilder);

                    /**
                     * @ignore
                     */
                    this.data = assign({
                        attrName: attrName,
                        propName: toCamelCase(attrName),
                        listeners: []
                    }, DEFAULT_DATA);
                }

                /**
                 * To handle the attribute/property value as a boolean:
                 * Attribute is present when true and missing when false.
                 * @returns {AttributeBuilder} the builder
                 */


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
                        var data = this.data,
                            defaultValue = result(this.data, 'value'),
                            descriptor = {
                            enumerable: this.data.enumerable,
                            configurable: false,
                            get: this.data.getterFactory(this.data.attrName, this.data.boolean),
                            set: this.data.setterFactory(this.data.attrName, this.data.boolean)
                        };

                        if (data.bound) {
                            Object.defineProperty(proto, data.propName, descriptor);
                        }

                        on('after:createdCallback').invoke(function (el) {
                            if (data.bound) {
                                var attrValue = getAttValue(el, data.attrName, data.boolean);
                                if (data.boolean) {
                                    el[data.propName] = !!defaultValue ? defaultValue : attrValue;
                                } else if (!isNull(attrValue) && !isUndefined(attrValue)) {
                                    el[data.propName] = attrValue;
                                } else if (!isUndefined(defaultValue)) {
                                    el[data.propName] = defaultValue;
                                }
                            }
                            if (data.listeners.length > 0) {
                                (function () {
                                    var oldValue = data.boolean ? false : null;
                                    var setValue = el[data.propName];
                                    if (oldValue !== setValue) {
                                        data.listeners.forEach(function (listener) {
                                            return listener.call(el, el, oldValue, setValue);
                                        });
                                    }
                                })();
                            }
                        });

                        on('before:attributeChangedCallback').invoke(function (el, attName, oldVal, newVal) {
                            // Synchronize the attribute value with its properties
                            if (attName === data.attrName) {
                                if (data.bound) {
                                    var newValue = data.boolean ? newVal === '' : newVal;
                                    if (el[data.propName] !== newValue) {
                                        el[data.propName] = newValue;
                                    }
                                }
                                if (data.listeners.length > 0) {
                                    (function () {
                                        var oldValue = data.boolean ? oldVal === '' : oldVal;
                                        var setValue = data.boolean ? newVal === '' : newVal;
                                        if (oldValue !== setValue) {
                                            data.listeners.forEach(function (listener) {
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
            }());

            _export('AttributeBuilder', AttributeBuilder);
        }
    };
});