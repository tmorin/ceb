'use strict';

define(['exports', '../helper/types.js', '../helper/objects.js'], function (exports, _types, _objects) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PropertyBuilder = undefined;
    exports.property = property;

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

    var DEFAULT_DATA = {
        enumerable: true,
        immutable: false,
        descriptorValue: true
    };

    var PropertyBuilder = (function () {
        function PropertyBuilder(propName) {
            _classCallCheck(this, PropertyBuilder);

            this.data = (0, _objects.assign)({
                propName: propName,
                listeners: []
            }, DEFAULT_DATA);
        }

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
                    defaultValue = (0, _objects.result)(this.data, 'value'),
                    descriptor = {
                    enumerable: this.data.enumerable
                };

                if (this.data.immutable) {
                    descriptor.configurable = false;
                    descriptor.writable = false;
                } else if ((0, _types.isFunction)(this.data.getter) || (0, _types.isFunction)(this.data.setter)) {
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
                    if (!data.descriptorValue && !(0, _types.isUndefined)(defaultValue)) {
                        el[data.propName] = defaultValue;
                    }
                });
            }
        }]);

        return PropertyBuilder;
    })();

    exports.PropertyBuilder = PropertyBuilder;

    function property(propName) {
        return new PropertyBuilder(propName);
    }
});