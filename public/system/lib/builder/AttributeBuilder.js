System.register(['lodash/string/camelCase.js', 'lodash/lang/isFunction.js', 'lodash/lang/isUndefined.js', 'lodash/object/result.js', 'lodash/lang/isNull.js', 'lodash/object/assign.js', './PropertyBuilder.js'], function (_export) {

    /**
     * Get the value from an attribute.
     * @param {!HTMLElement} el an HTML element
     * @param {!string} attrName the name of the attribute
     * @param {!boolean} isBoolean true is the returned value should be a boolean
     * @returns {string|boolean}
     */
    'use strict';

    var camelCase, isFunction, isUndefined, result, isNull, assign, PropertyBuilder, AttributeBuilder;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    /**
     * Set the value of an attribute.
     * @param {!HTMLElement} el an HTML element
     * @param {!string} attrName the name of the attribute
     * @param {!boolean} isBoolean true is the value should be a boolean
     * @param {string|boolean} value the value to set
     */

    _export('getAttValue', getAttValue);

    _export('setAttValue', setAttValue);

    _export('default', helper);

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function getAttValue(el, attrName, isBoolean) {
        if (isBoolean) {
            //let value = el.getAttribute(attrName);
            return el.hasAttribute(attrName);
        }
        return el.getAttribute(attrName);
    }

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

    function getterFactory(attrName, isBoolean) {
        return function (el) {
            return getAttValue(el, attrName, isBoolean);
        };
    }

    function setterFactory(attrName, isBoolean, attSetter) {
        return function (el, value) {
            var attValue = isFunction(attSetter) ? attSetter.call(el, el, value) : value;
            return setAttValue(el, attrName, isBoolean, attValue);
        };
    }

    /**
     * The attribute builder.
     * Its goal is to provide a way to define an attribute.
     * @extends {PropertyBuilder}
     */

    /**
     * @ignore
     */

    function helper(attName) {
        return new AttributeBuilder(attName);
    }

    return {
        setters: [function (_lodashStringCamelCaseJs) {
            camelCase = _lodashStringCamelCaseJs['default'];
        }, function (_lodashLangIsFunctionJs) {
            isFunction = _lodashLangIsFunctionJs['default'];
        }, function (_lodashLangIsUndefinedJs) {
            isUndefined = _lodashLangIsUndefinedJs['default'];
        }, function (_lodashObjectResultJs) {
            result = _lodashObjectResultJs['default'];
        }, function (_lodashLangIsNullJs) {
            isNull = _lodashLangIsNullJs['default'];
        }, function (_lodashObjectAssignJs) {
            assign = _lodashObjectAssignJs['default'];
        }, function (_PropertyBuilderJs) {
            PropertyBuilder = _PropertyBuilderJs.PropertyBuilder;
        }],
        execute: function () {
            AttributeBuilder = (function (_PropertyBuilder) {
                _inherits(AttributeBuilder, _PropertyBuilder);

                /**
                 * @param {!string} attrName the name of the attribute
                 */

                function AttributeBuilder(attrName) {
                    _classCallCheck(this, AttributeBuilder);

                    _get(Object.getPrototypeOf(AttributeBuilder.prototype), 'constructor', this).call(this, camelCase(attrName));
                    /**
                     * @ignore
                     */
                    assign(this.data, {
                        attrName: attrName,
                        getterFactory: getterFactory,
                        setterFactory: setterFactory,
                        descriptorValue: false,
                        getAttValue: getAttValue,
                        setAttValue: setAttValue
                    });
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

                    /**
                     * To override the property name.
                     * @param {!string} propName the property name
                     * @returns {AttributeBuilder}
                     */
                }, {
                    key: 'property',
                    value: function property(propName) {
                        this.data.propName = propName;
                        return this;
                    }

                    /**
                     * @override
                     */
                }, {
                    key: 'build',
                    value: function build(proto, on) {
                        var _this = this;

                        var attGetter = this.data.getter,
                            attSetter = this.data.setter,
                            defaultValue = result(this.data, 'value');

                        this.data.value = undefined;

                        this.data.getter = this.data.getterFactory(this.data.attrName, this.data.boolean, attGetter);
                        this.data.setter = this.data.setterFactory(this.data.attrName, this.data.boolean, attSetter);

                        _get(Object.getPrototypeOf(AttributeBuilder.prototype), 'build', this).call(this, proto, on);

                        /*on('before:createdCallback').invoke(el => {
                            let attrValue = getAttValue(el, this.data.attrName, this.data.boolean);
                            if (this.data.boolean) {
                                console.log(el);
                                console.log('default', this.data.value);
                                console.log('attrValue', attrValue);
                                this.data.value = !!this.data.value ? this.data.value : attrValue;
                            } else if (!isNull(attrValue) && !isUndefined(attrValue)) {
                                this.data.value = attrValue;
                            }
                        });*/

                        on('after:createdCallback').invoke(function (el) {
                            var attrValue = getAttValue(el, _this.data.attrName, _this.data.boolean);
                            if (_this.data.boolean) {
                                el[_this.data.propName] = !!defaultValue ? defaultValue : attrValue;
                            } else if (!isNull(attrValue) && !isUndefined(attrValue)) {
                                el[_this.data.propName] = attrValue;
                            } else if (!isUndefined(defaultValue)) {
                                el[_this.data.propName] = defaultValue;
                            }
                        });

                        on('before:attributeChangedCallback').invoke(function (el, attName, oldVal, newVal) {
                            // Synchronize the attribute value with its properties
                            if (attName === _this.data.attrName) {
                                var value = _this.data.boolean ? newVal === '' : newVal;
                                if (el[_this.data.propName] !== value) {
                                    el[_this.data.propName] = value;
                                }
                            }
                        });
                    }
                }]);

                return AttributeBuilder;
            })(PropertyBuilder);

            _export('AttributeBuilder', AttributeBuilder);
        }
    };
});