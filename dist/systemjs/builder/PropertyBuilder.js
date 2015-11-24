'use strict';

System.register(['babel-runtime/core-js/object/define-property', 'babel-runtime/core-js/object/get-prototype-of', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/helpers/possibleConstructorReturn', 'babel-runtime/helpers/inherits', './Builder.js', '../utils.js'], function (_export) {
    var _Object$defineProperty, _Object$getPrototypeOf, _classCallCheck, _createClass, _possibleConstructorReturn, _inherits, Builder, isFunction, isUndefined, result, assign, DEFAULT_DATA, PropertyBuilder;

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
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }, function (_utilsJs) {
            isFunction = _utilsJs.isFunction;
            isUndefined = _utilsJs.isUndefined;
            result = _utilsJs.result;
            assign = _utilsJs.assign;
        }],
        execute: function () {
            DEFAULT_DATA = {
                enumerable: true,
                immutable: false,
                descriptorValue: true
            };

            _export('PropertyBuilder', PropertyBuilder = (function (_Builder) {
                _inherits(PropertyBuilder, _Builder);

                function PropertyBuilder(propName) {
                    _classCallCheck(this, PropertyBuilder);

                    var _this = _possibleConstructorReturn(this, _Object$getPrototypeOf(PropertyBuilder).call(this));

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

                        _Object$defineProperty(proto, this.data.propName, descriptor);

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