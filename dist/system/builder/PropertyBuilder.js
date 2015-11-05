'use strict';

System.register(['./Builder.js', '../utils.js'], function (_export) {
    var Builder, isFunction, isUndefined, result, assign, _createClass, DEFAULT_DATA, PropertyBuilder;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    return {
        setters: [function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }, function (_utilsJs) {
            isFunction = _utilsJs.isFunction;
            isUndefined = _utilsJs.isUndefined;
            result = _utilsJs.result;
            assign = _utilsJs.assign;
        }],
        execute: function () {
            _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            DEFAULT_DATA = {
                enumerable: true,
                immutable: false,
                descriptorValue: true
            };

            _export('PropertyBuilder', PropertyBuilder = (function (_Builder) {
                _inherits(PropertyBuilder, _Builder);

                function PropertyBuilder(propName) {
                    _classCallCheck(this, PropertyBuilder);

                    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PropertyBuilder).call(this));

                    _this.data = assign({
                        propName: propName
                    }, DEFAULT_DATA);
                    return _this;
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
                        var _this2 = this;

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
                            if (!_this2.data.descriptorValue && !isUndefined(defaultValue)) {
                                el[data.propName] = defaultValue;
                            }
                        });
                    }
                }]);

                return PropertyBuilder;
            })(Builder));

            _export('PropertyBuilder', PropertyBuilder);
        }
    };
});