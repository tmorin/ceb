'use strict';

System.register(['../helper/types.js', '../helper/objects.js'], function (_export, _context) {
    "use strict";

    var isFunction, isUndefined, result, assign, _createClass, DEFAULT_DATA, PropertyBuilder;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    /**
     * Get a new property builder.
     * @param {!string} propName the name of the property
     * @returns {PropertyBuilder} the property builder
     */
    function property(propName) {
        return new PropertyBuilder(propName);
    }

    _export('property', property);

    return {
        setters: [function (_helperTypesJs) {
            isFunction = _helperTypesJs.isFunction;
            isUndefined = _helperTypesJs.isUndefined;
        }, function (_helperObjectsJs) {
            result = _helperObjectsJs.result;
            assign = _helperObjectsJs.assign;
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
                enumerable: true,
                immutable: false,
                descriptorValue: true
            };

            _export('PropertyBuilder', PropertyBuilder = function () {

                /**
                 * @param {!string} propName the name of the property
                 */
                function PropertyBuilder(propName) {
                    _classCallCheck(this, PropertyBuilder);

                    /**
                     * @ignore
                     */
                    this.data = assign({ propName: propName, listeners: [] }, DEFAULT_DATA);
                }

                /**
                 * To make an immutable property.
                 * @returns {PropertyBuilder} the builder
                 */


                _createClass(PropertyBuilder, [{
                    key: 'immutable',
                    value: function immutable() {
                        this.data.immutable = true;
                        return this;
                    }
                }, {
                    key: 'hidden',
                    value: function hidden() {
                        this.data.enumerable = false;
                        return this;
                    }
                }, {
                    key: 'value',
                    value: function value(_value) {
                        this.data.value = _value;
                        return this;
                    }
                }, {
                    key: 'getter',
                    value: function getter(fn) {
                        this.data.descriptorValue = false;
                        this.data.getter = fn;
                        return this;
                    }
                }, {
                    key: 'setter',
                    value: function setter(fn) {
                        this.data.descriptorValue = false;
                        this.data.setter = fn;
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
                            enumerable: this.data.enumerable
                        };

                        if (this.data.immutable) {
                            descriptor.configurable = false;
                            descriptor.writable = false;
                        } else if (isFunction(this.data.getter) || isFunction(this.data.setter)) {
                            descriptor.configurable = false;
                            descriptor.get = function () {
                                if (data.getter) {
                                    return data.getter.call(this, this);
                                }
                            };
                            descriptor.set = function (value) {
                                if (data.setter) {
                                    return data.setter.call(this, this, value);
                                }
                            };
                        } else {
                            descriptor.configurable = true;
                            descriptor.writable = true;
                        }

                        if (data.listeners.length > 0) {
                            (function () {
                                descriptor.configurable = false;
                                delete descriptor.writable;
                                data.descriptorValue = false;
                                var _propName = '__' + data.propName + 'LastSetValue';
                                if (!descriptor.get) {
                                    descriptor.get = function () {
                                        return this[_propName];
                                    };
                                }
                                descriptor.set = function (newVal) {
                                    var _this = this;

                                    var oldVal = this[_propName];
                                    this[_propName] = newVal;
                                    if (data.setter) {
                                        data.setter.call(this, this, newVal);
                                    }
                                    data.listeners.forEach(function (listener) {
                                        listener.call(_this, _this, oldVal, newVal);
                                    });
                                };
                            })();
                        }

                        if (data.descriptorValue) {
                            descriptor.value = defaultValue;
                        }

                        Object.defineProperty(proto, this.data.propName, descriptor);

                        on('after:createdCallback').invoke(function (el) {
                            if (!data.descriptorValue && !isUndefined(defaultValue)) {
                                el[data.propName] = defaultValue;
                            }
                        });
                    }
                }]);

                return PropertyBuilder;
            }());

            _export('PropertyBuilder', PropertyBuilder);
        }
    };
});