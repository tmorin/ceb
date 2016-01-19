(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '../helper/types.js', '../helper/converters.js', './attribute.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('../helper/types.js'), require('../helper/converters.js'), require('./attribute.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.types, global.converters, global.attribute);
        global.delegate = mod.exports;
    }
})(this, function (exports, _types, _converters, _attribute) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DelegateBuilder = undefined;
    exports.delegate = delegate;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
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

    var DelegateBuilder = exports.DelegateBuilder = function () {

        /**
         * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} fieldBuilder the field builder
         */

        function DelegateBuilder(fieldBuilder) {
            _classCallCheck(this, DelegateBuilder);

            /**
             * @ignore
             */
            this.fieldBuilder = fieldBuilder;
            /**
             * @ignore
             */
            this.data = {};
            if (fieldBuilder.data.attrName) {
                this.data.attrName = fieldBuilder.data.attrName;
            } else if (this.fieldBuilder.data.propName) {
                this.data.propName = fieldBuilder.data.propName;
            } else if (this.fieldBuilder.data.methName) {
                this.data.methName = fieldBuilder.data.methName;
            }
        }

        /**
         * The target of the delegate.
         * @param {!string} selector a valid css query
         * @returns {DelegateBuilder} the builder
         */

        _createClass(DelegateBuilder, [{
            key: 'to',
            value: function to(selector) {
                this.data.selector = selector;
                return this;
            }

            /**
             * To force the delegation to a property.
             * @param {string} [propName] the name of the property
             * @returns {DelegateBuilder} the builder
             */

        }, {
            key: 'property',
            value: function property(propName) {
                this.data.attrName = null;
                if (!(0, _types.isUndefined)(propName)) {
                    this.data.propName = propName;
                } else {
                    this.data.propName = this.fieldBuilder.data.propName;
                }
                return this;
            }

            /**
             * To force the delegation to an attribute.
             * @param {string} [attrName] the name of the attribute
             * @returns {DelegateBuilder} the builder
             */

        }, {
            key: 'attribute',
            value: function attribute(attrName) {
                this.data.propName = null;
                if (!(0, _types.isUndefined)(attrName)) {
                    this.data.attrName = attrName;
                } else {
                    this.data.attrName = this.fieldBuilder.data.attrName || this.fieldBuilder.data.propName;
                }
                return this;
            }

            /**
             * To force the delegation to a method.
             * @param {string} [methName] the name of the method
             * @returns {DelegateBuilder} the builder
             */

        }, {
            key: 'method',
            value: function method(methName) {
                this.data.methName = null;
                if (!(0, _types.isUndefined)(methName)) {
                    this.data.methName = methName;
                } else {
                    this.data.methName = this.fieldBuilder.data.methName;
                }
                return this;
            }

            /**
             * Logic of the builder.
             * @param {!ElementBuilder.context.proto} proto the prototype
             * @param {!ElementBuilder.on} on the method on
             */

        }, {
            key: 'build',
            value: function build(proto, on) {
                var data = this.data,
                    fieldBuilderData = this.fieldBuilder.data,
                    targetedPropName = this.data.propName,
                    targetedMethName = this.data.methName,
                    targetedAttrName = this.data.attrName,
                    fieldGetter = fieldBuilderData.getter,
                    fieldSetter = fieldBuilderData.setter;

                if (fieldBuilderData.attrName) {
                    fieldBuilderData.getterFactory = function (attrName, isBoolean) {
                        return function () {
                            var target = this.querySelector(data.selector);
                            if (target) {
                                return targetedAttrName ? (0, _attribute.getAttValue)(target, targetedAttrName, isBoolean) : target[targetedPropName];
                            }
                        };
                    };
                    fieldBuilderData.setterFactory = function (attrName, isBoolean) {
                        return function (value) {
                            var target = this.querySelector(data.selector),
                                attrValue = value;
                            if (target) {
                                if (targetedAttrName) {
                                    (0, _attribute.setAttValue)(target, targetedAttrName, isBoolean, attrValue);
                                } else {
                                    target[targetedPropName] = attrValue;
                                }
                                (0, _attribute.setAttValue)(this, attrName, isBoolean, attrValue);
                            }
                        };
                    };
                } else if (fieldBuilderData.propName) {
                    fieldBuilderData.descriptorValue = false;
                    fieldBuilderData.getter = function (el) {
                        var target = el.querySelector(data.selector),
                            targetValue = undefined;
                        if (target) {
                            if (targetedAttrName) {
                                targetValue = target.getAttribute(targetedAttrName);
                            } else {
                                targetValue = target[targetedPropName];
                            }
                        }
                        return (0, _types.isFunction)(fieldGetter) ? fieldGetter.call(el, el, targetValue) : targetValue;
                    };
                    fieldBuilderData.setter = function (el, value) {
                        var target = el.querySelector(data.selector),
                            targetValue = (0, _types.isFunction)(fieldSetter) ? fieldSetter.call(el, el, value) : value;
                        if (target) {
                            if (targetedAttrName) {
                                target.setAttribute(targetedAttrName, targetValue);
                            } else {
                                target[targetedPropName] = targetValue;
                            }
                        }
                    };
                } else if (fieldBuilderData.methName) {
                    fieldBuilderData.invoke = function (el) {
                        var target = el.querySelector(data.selector);
                        if ((0, _types.isFunction)(target[targetedMethName])) {
                            var args = (0, _converters.toArray)(arguments);
                            if (!fieldBuilderData.native) {
                                args.shift();
                            }
                            return target[targetedMethName].apply(target, args);
                        }
                    };
                }

                this.fieldBuilder.build(proto, on);
            }
        }]);

        return DelegateBuilder;
    }();

    function delegate(builder) {
        return new DelegateBuilder(builder);
    }
});