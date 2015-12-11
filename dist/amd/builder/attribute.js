'use strict';

define(['exports', '../helper/types.js', '../helper/objects.js', '../helper/converters.js'], function (exports, _types, _objects, _converters) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AttributeBuilder = undefined;
    exports.getAttValue = getAttValue;
    exports.setAttValue = setAttValue;
    exports.attribute = attribute;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = (function () {
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

    function setAttValue(el, attrName, isBoolean, value) {
        if (isBoolean) {
            if (value && !el.hasAttribute(attrName)) {
                el.setAttribute(attrName, '');
            } else if (!value && el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
            }
        } else {
            if (((0, _types.isUndefined)(value) || (0, _types.isNull)(value)) && el.hasAttribute(attrName)) {
                el.removeAttribute(attrName);
            } else if (!(0, _types.isUndefined)(value) && !(0, _types.isNull)(value) && el.getAttribute(attrName) !== value) {
                el.setAttribute(attrName, value);
            }
        }
    }

    function getterFactory(attrName, isBoolean) {
        return function () {
            return getAttValue(this, attrName, isBoolean);
        };
    }

    function setterFactory(attrName, isBoolean, attSetter) {
        return function (value) {
            var attValue = (0, _types.isFunction)(attSetter) ? attSetter.call(this, this, value) : value;
            return setAttValue(this, attrName, isBoolean, attValue);
        };
    }

    var DEFAULT_DATA = {
        bound: true,
        getterFactory: getterFactory,
        setterFactory: setterFactory,
        getAttValue: getAttValue,
        setAttValue: setAttValue
    };

    var AttributeBuilder = (function () {
        function AttributeBuilder(attrName) {
            _classCallCheck(this, AttributeBuilder);

            this.data = (0, _objects.assign)({
                attrName: attrName,
                propName: (0, _converters.toCamelCase)(attrName),
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
                var data = this.data,
                    defaultValue = (0, _objects.result)(this.data, 'value'),
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
                        } else if (!(0, _types.isNull)(attrValue) && !(0, _types.isUndefined)(attrValue)) {
                            el[data.propName] = attrValue;
                        } else if (!(0, _types.isUndefined)(defaultValue)) {
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
    })();

    exports.AttributeBuilder = AttributeBuilder;

    function attribute(attrName) {
        return new AttributeBuilder(attrName);
    }
});