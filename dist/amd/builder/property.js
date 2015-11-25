'use strict';

define(['exports', '../helper/type.js', '../helper/object.js'], function (exports, _type, _object) {
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

            this.data = (0, _object.assign)({
                propName: propName
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
            key: 'build',
            value: function build(proto, on) {
                var _this = this;

                var data = this.data,
                    defaultValue = (0, _object.result)(this.data, 'value'),
                    descriptor = {
                    enumerable: this.data.enumerable
                };

                if (this.data.immutable) {
                    descriptor.configurable = false;
                    descriptor.writable = false;
                } else if ((0, _type.isFunction)(this.data.getter) || (0, _type.isFunction)(this.data.setter)) {
                    descriptor.configurable = false;

                    descriptor.get = function () {
                        return data.getter.call(this, this);
                    };

                    descriptor.set = function (value) {
                        return data.setter.call(this, this, value);
                    };
                } else {
                    descriptor.configurable = true;
                    descriptor.writable = true;
                }

                if (this.data.descriptorValue) {
                    descriptor.value = defaultValue;
                }

                Object.defineProperty(proto, this.data.propName, descriptor);
                on('after:createdCallback').invoke(function (el) {
                    if (!_this.data.descriptorValue && !(0, _type.isUndefined)(defaultValue)) {
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