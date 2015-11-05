(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ceb = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AttributeBuilder = undefined;
exports.getAttValue = getAttValue;
exports.setAttValue = setAttValue;

var _utils = require('../utils.js');

var _PropertyBuilder2 = require('./PropertyBuilder.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        if (((0, _utils.isUndefined)(value) || (0, _utils.isNull)(value)) && el.hasAttribute(attrName)) {
            // There is no value, so the attribute must be removed
            el.removeAttribute(attrName);
        } else if (!(0, _utils.isUndefined)(value) && !(0, _utils.isNull)(value) && el.getAttribute(attrName) !== value) {
            // Sync the attribute value with value
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
        var attValue = (0, _utils.isFunction)(attSetter) ? attSetter.call(this, this, value) : value;
        return setAttValue(this, attrName, isBoolean, attValue);
    };
}

/**
 * The attribute builder.
 * Its goal is to provide a way to define an attribute.
 * @extends {PropertyBuilder}
 */

var AttributeBuilder = exports.AttributeBuilder = (function (_PropertyBuilder) {
    _inherits(AttributeBuilder, _PropertyBuilder);

    /**
     * @param {!string} attrName the name of the attribute
     */

    function AttributeBuilder(attrName) {
        _classCallCheck(this, AttributeBuilder);

        /**
         * @ignore
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AttributeBuilder).call(this, (0, _utils.camelCase)(attrName)));

        (0, _utils.assign)(_this.data, {
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
         * To skip the link between the attribute and its property
         * @returns {AttributeBuilder} the builder
         */

    }, {
        key: 'unbound',
        value: function unbound() {
            this.data.bound = false;
            return this;
        }

        /**
         * To override the property name.
         * @param {!string} propName the property name
         * @returns {AttributeBuilder} the builder
         */

    }, {
        key: 'property',
        value: function property(propName) {
            this.data.propName = propName;
            return this;
        }

        /**
         * To be notified when the attribute is updated.
         * @param {function(el: HTMLElement, oldVal: string, newVal: string)} listener the listener function
         * @returns {AttributeBuilder} the builder
         */

    }, {
        key: 'listen',
        value: function listen(listener) {
            this.data.listeners.push(listener);
            return this;
        }

        /**
         * @override
         */

    }, {
        key: 'build',
        value: function build(proto, on) {
            var _this2 = this;

            var defaultValue = (0, _utils.result)(this.data, 'value'),
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
                    } else if (!(0, _utils.isNull)(attrValue) && !(0, _utils.isUndefined)(attrValue)) {
                        el[_this2.data.propName] = attrValue;
                    } else if (!(0, _utils.isUndefined)(defaultValue)) {
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
                // Synchronize the attribute value with its properties
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
})(_PropertyBuilder2.PropertyBuilder);

},{"../utils.js":10,"./PropertyBuilder.js":7}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A builder is defined by a build method.
 * @abstract
 */

var Builder = exports.Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);
  }

  _createClass(Builder, [{
    key: 'build',

    /**
     * To specify the logic of the builder.
     * @param {!CustomElementBuilder.context.proto} proto the prototype
     * @param {!CustomElementBuilder.on} on the method on
     */
    value: function build() {
      throw new Error('not implemented');
    }
  }]);

  return Builder;
})();

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CustomElementBuilder = undefined;

var _utils = require('../utils.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LIFECYCLE_CALLBACKS = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];

var LIFECYCLE_EVENTS = (0, _utils.flatten)(LIFECYCLE_CALLBACKS.map(function (name) {
    return ['before:' + name, 'after:' + name];
}));

function applyLifecycle(context, name) {
    var proto = context.proto,
        original = proto[name],
        beforeFns = context.events['before:' + name],
        afterFns = context.events['after:' + name];

    proto[name] = function () {
        var _this = this;

        var args = [this].concat((0, _utils.toArray)(arguments));

        beforeFns.forEach(function (fn) {
            return fn.apply(_this, args);
        });

        if ((0, _utils.isFunction)(original)) {
            original.apply(this, args);
        }

        afterFns.forEach(function (fn) {
            return fn.apply(_this, args);
        });
    };
}

/**
 * The custom element builder.
 * Its goal is to provide a user friendly way to do it by some else (i.e. dedicated builders).
 */

var CustomElementBuilder = (function () {

    /**
     */

    function CustomElementBuilder() {
        _classCallCheck(this, CustomElementBuilder);

        var proto = Object.create(HTMLElement.prototype),
            builders = [],
            events = LIFECYCLE_EVENTS.reduce(function (a, b) {
            a[b] = [];
            return a;
        }, {
            'before:builders': [],
            'after:builders': [],
            'before:registerElement': [],
            'after:registerElement': []
        });
        /**
         * @type {Object}
         * @property {!Object} proto - the prototype
         * @property {!string} extends - the name of a native element
         * @desc the context of the builder
         */
        this.context = { proto: proto, builders: builders, events: events };
    }

    /**
     * To extend a native element.
     * @param {!string} value the name of the element
     * @returns {CustomElementBuilder} the builder
     */

    _createClass(CustomElementBuilder, [{
        key: 'extend',
        value: function extend(value) {
            this.context.extend = value;
            return this;
        }

        /**
         * To override the default prototype.
         * @param {!Object} value the prototype
         * @returns {CustomElementBuilder} the builder
         */

    }, {
        key: 'proto',
        value: function proto(value) {
            this.context.proto = value;
            return this;
        }

        /**
         * To apply the given builders during the build process.
         * @param {...Builder} builders the builders
         * @returns {CustomElementBuilder} the builder
         */

    }, {
        key: 'builders',
        value: function builders() {
            var _this2 = this;

            for (var _len = arguments.length, _builders = Array(_len), _key = 0; _key < _len; _key++) {
                _builders[_key] = arguments[_key];
            }

            _builders.forEach(function (builder) {
                return _this2.context.builders.push(builder);
            });
            return this;
        }

        /**
         * To register call back on events.
         * @param {!string} event the event name
         * @returns {Object} the on builder.
         * @property {function(callback: function)} invoke - to register the callback
         */

    }, {
        key: 'on',
        value: function on(event) {
            var _this3 = this;

            var invoke = function invoke(cb) {
                _this3.context.events[event].push(cb);
                return _this3;
            };
            return { invoke: invoke };
        }

        /**
         * To register the custom element.
         * @param {!string} name the name of the cutsom element
         * @returns {Element} the custom element Type
         */

    }, {
        key: 'register',
        value: function register(name) {
            var _this4 = this;

            this.context.events['before:builders'].forEach(function (fn) {
                return fn(_this4.context);
            });

            (0, _utils.invoke)(this.context.builders, 'build', this.context.proto, (0, _utils.bind)(this.on, this));

            this.context.events['after:builders'].forEach(function (fn) {
                return fn(_this4.context);
            });

            LIFECYCLE_CALLBACKS.forEach((0, _utils.partial)(applyLifecycle, this.context));

            var options = { prototype: this.context.proto };

            if ((0, _utils.isString)(this.context.extend)) {
                options.extends = this.context.extend;
            }

            this.context.events['before:registerElement'].forEach(function (fn) {
                return fn(_this4.context);
            });

            var CustomElement = document.registerElement(name, options);

            this.context.events['after:registerElement'].forEach(function (fn) {
                return fn(CustomElement);
            });

            return CustomElement;
        }
    }]);

    return CustomElementBuilder;
})();

exports.CustomElementBuilder = CustomElementBuilder;

},{"../utils.js":10}],4:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DelegateBuilder = undefined;

var _utils = require('../utils.js');

var _AttributeBuilder = require('./AttributeBuilder.js');

var _Builder2 = require('./Builder.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The delegate builder.
 * Its goal is to provide a way to delegate methods, properties and attributes.
 * @extends {Builder}
 */

var DelegateBuilder = exports.DelegateBuilder = (function (_Builder) {
    _inherits(DelegateBuilder, _Builder);

    /**
     * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} fieldBuilder the field builder
     */

    function DelegateBuilder(fieldBuilder) {
        _classCallCheck(this, DelegateBuilder);

        /**
         * @ignore
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DelegateBuilder).call(this));

        _this.fieldBuilder = fieldBuilder;
        /**
         * @ignore
         */
        _this.data = {};
        if (fieldBuilder.data.attrName) {
            _this.data.attrName = fieldBuilder.data.attrName;
        } else if (_this.fieldBuilder.data.propName) {
            _this.data.propName = fieldBuilder.data.propName;
        } else if (_this.fieldBuilder.data.methName) {
            _this.data.methName = fieldBuilder.data.methName;
        }
        return _this;
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
            if (!(0, _utils.isUndefined)(propName)) {
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
            if (!(0, _utils.isUndefined)(attrName)) {
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
            if (!(0, _utils.isUndefined)(methName)) {
                this.data.methName = methName;
            } else {
                this.data.methName = this.fieldBuilder.data.methName;
            }
            return this;
        }

        /**
         * @override
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
                            return targetedAttrName ? (0, _AttributeBuilder.getAttValue)(target, targetedAttrName, isBoolean) : target[targetedPropName];
                        }
                    };
                };
                fieldBuilderData.setterFactory = function (attrName, isBoolean) {
                    return function (value) {
                        var target = this.querySelector(data.selector),
                            attrValue = value;
                        if (target) {
                            if (targetedAttrName) {
                                (0, _AttributeBuilder.setAttValue)(target, targetedAttrName, isBoolean, attrValue);
                            } else {
                                target[targetedPropName] = attrValue;
                            }
                            (0, _AttributeBuilder.setAttValue)(this, attrName, isBoolean, attrValue);
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
                    return (0, _utils.isFunction)(fieldGetter) ? fieldGetter.call(el, el, targetValue) : targetValue;
                };
                fieldBuilderData.setter = function (el, value) {
                    var target = el.querySelector(data.selector),
                        targetValue = (0, _utils.isFunction)(fieldSetter) ? fieldSetter.call(el, el, value) : value;
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
                    if ((0, _utils.isFunction)(target[targetedMethName])) {
                        var args = (0, _utils.toArray)(arguments);
                        args.shift();
                        return target[targetedMethName].apply(target, args);
                    }
                };
            }

            this.fieldBuilder.build(proto, on);
        }
    }]);

    return DelegateBuilder;
})(_Builder2.Builder);

},{"../utils.js":10,"./AttributeBuilder.js":1,"./Builder.js":2}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MethodBuilder = undefined;

var _utils = require('../utils.js');

var _Builder2 = require('./Builder.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The method builder.
 * Its goal is to provide a way to define a method.
 * @extends {Builder}
 */

var MethodBuilder = exports.MethodBuilder = (function (_Builder) {
    _inherits(MethodBuilder, _Builder);

    /**
     * @param {!string} methName the name of the method
     */

    function MethodBuilder(methName) {
        _classCallCheck(this, MethodBuilder);

        /**
         * @ignore
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MethodBuilder).call(this));

        _this.data = { methName: methName, wrappers: [] };
        return _this;
    }

    /**
     * To do something when invoked.
     * @param {!function(el: HTMLElement, args: ...*)} fn the method's logic
     * @returns {MethodBuilder} the builder
     */

    _createClass(MethodBuilder, [{
        key: 'invoke',
        value: function invoke(fn) {
            if ((0, _utils.isFunction)(fn)) {
                this.data.invoke = fn;
            }
            return this;
        }

        /**
         * To do something around the invocation.
         * @param {...function(el: HTMLElement, args: ...*)} wrappers a set of wrappers
         * @returns {MethodBuilder} the builder
         */

    }, {
        key: 'wrap',
        value: function wrap() {
            for (var _len = arguments.length, wrappers = Array(_len), _key = 0; _key < _len; _key++) {
                wrappers[_key] = arguments[_key];
            }

            this.data.wrappers = this.data.wrappers.concat(wrappers);
            return this;
        }

        /**
         * @override
         */

    }, {
        key: 'build',
        value: function build(proto, on) {
            var data = this.data;

            if (data.invoke) {
                proto[data.methName] = function () {
                    return data.invoke.apply(this, [this].concat((0, _utils.toArray)(arguments)));
                };
            }

            if (data.wrappers.length) {
                on('before:createdCallback').invoke(function (el) {
                    if ((0, _utils.isFunction)(el[data.methName])) {
                        (function () {
                            var lastIndex = data.wrappers.length - 1,
                                original = el[data.methName],
                                target = function target() {
                                var args = (0, _utils.toArray)(arguments);
                                args.shift();
                                original.apply(el, args);
                            };
                            el[data.methName] = data.wrappers.reduce(function (next, current, index) {
                                if (index === lastIndex) {
                                    return (0, _utils.bind)((0, _utils.partial)(current, next, el), el);
                                }
                                return (0, _utils.bind)((0, _utils.partial)(current, next), el);
                            }, target);
                        })();
                    }
                });
            }
        }
    }]);

    return MethodBuilder;
})(_Builder2.Builder);

},{"../utils.js":10,"./Builder.js":2}],6:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OnBuilder = undefined;

var _utils = require('../utils.js');

var _Builder2 = require('./Builder.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The on builder.
 * Its goal is to provide a way to listen events coming from the custom element.
 * @extends {Builder}
 */

var OnBuilder = exports.OnBuilder = (function (_Builder) {
    _inherits(OnBuilder, _Builder);

    /**
     * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
     */

    function OnBuilder(events) {
        _classCallCheck(this, OnBuilder);

        /**
         * @ignore
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OnBuilder).call(this));

        _this.data = { events: events, invoke: _utils.noop };
        return _this;
    }

    /**
     * To do something when events occurred.
     * The target argument is by default the custom element.
     * When the delegate feature is used, target is the matched element.
     * @param {!function(el: HTMLElement, evt: DOMEvent, target: HTMLElement)} fn the event's logic
     * @returns {OnBuilder} the builder
     */

    _createClass(OnBuilder, [{
        key: 'invoke',
        value: function invoke(fn) {
            if ((0, _utils.isFunction)(fn)) {
                this.data.invoke = fn;
            }
            return this;
        }

        /**
         * To attach the event on the capture phase insteadof of on the bubble phase.
         * @returns {OnBuilder} the builder
         */

    }, {
        key: 'capture',
        value: function capture() {
            this.data.capture = true;
            return this;
        }

        /**
         * To delegate the event.
         * @param {!string} selector the selector
         * @returns {OnBuilder} the builder
         */

    }, {
        key: 'delegate',
        value: function delegate(selector) {
            this.data.selector = selector;
            return this;
        }

        /**
         * To prevent the default behavior.
         * @returns {OnBuilder} the builder
         */

    }, {
        key: 'prevent',
        value: function prevent() {
            this.data.preventDefault = true;
            return this;
        }

        /**
         * To stop the event propagation.
         * @returns {OnBuilder} the builder
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.data.stopPropagation = true;
            return this;
        }

        /**
         * To prevent the default behavior and to stop the event propagation.
         * @returns {OnBuilder} the builder
         */

    }, {
        key: 'skip',
        value: function skip() {
            return this.prevent().stop();
        }

        /**
         * @ignore
         */

    }, {
        key: 'build',
        value: function build(proto, on) {
            var events = this.data.events.split(',').map(function (event) {
                return event.trim().split(' ');
            }),
                capture = !!this.data.capture,
                invoke = this.data.invoke,
                selector = this.data.selector,
                stopPropagation = this.data.stopPropagation,
                preventDefault = this.data.preventDefault;

            on('before:createdCallback').invoke(function (el) {
                el._cebOnHandlers = [];
            });

            on('before:attachedCallback').invoke(function (el) {
                var listener = function listener(evt) {
                    if (selector) {
                        var target = (0, _utils.find)((0, _utils.toArray)(el.querySelectorAll(selector)), function (el) {
                            return el === evt.target || el.contains(evt.target);
                        });
                        if (target) {
                            if (stopPropagation) {
                                evt.stopPropagation();
                            }
                            if (preventDefault) {
                                evt.preventDefault();
                            }
                            invoke(el, evt, target);
                        }
                    } else {
                        if (stopPropagation) {
                            evt.stopPropagation();
                        }
                        if (preventDefault) {
                            evt.preventDefault();
                        }
                        invoke(el, evt, el);
                    }
                };

                el._cebOnHandlers = events.map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2);

                    var name = _ref2[0];
                    var target = _ref2[1];
                    return [name, target ? el.querySelector(target) : el];
                }).filter(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2);

                    var name = _ref4[0];
                    var target = _ref4[1];
                    return !!target;
                }).map(function (_ref5) {
                    var _ref6 = _slicedToArray(_ref5, 2);

                    var name = _ref6[0];
                    var target = _ref6[1];

                    target.addEventListener(name, listener, capture);
                    return [target, name, listener, capture];
                });

                el._cebOnHandlers.forEach(function (_ref7) {
                    var _ref8 = _slicedToArray(_ref7, 4);

                    var target = _ref8[0];
                    var name = _ref8[1];
                    var listener = _ref8[2];
                    var capture = _ref8[3];
                    return target.addEventListener(name, listener, capture);
                });
            });

            on('before:detachedCallback').invoke(function (el) {
                el._cebOnHandlers.forEach(function (_ref9) {
                    var _ref10 = _slicedToArray(_ref9, 4);

                    var target = _ref10[0];
                    var name = _ref10[1];
                    var listener = _ref10[2];
                    var capture = _ref10[3];
                    return target.removeEventListener(name, listener, capture);
                });
            });
        }
    }]);

    return OnBuilder;
})(_Builder2.Builder);

},{"../utils.js":10,"./Builder.js":2}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PropertyBuilder = undefined;

var _Builder2 = require('./Builder.js');

var _utils = require('../utils.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_DATA = {
    enumerable: true,
    immutable: false,
    descriptorValue: true
};

/**
 * The property builder.
 * Its goal is to provide a way to define a property.
 * @extends {Builder}
 */

var PropertyBuilder = (function (_Builder) {
    _inherits(PropertyBuilder, _Builder);

    /**
     * @param {!string} propName the name of the property
     */

    function PropertyBuilder(propName) {
        _classCallCheck(this, PropertyBuilder);

        /**
         * @ignore
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PropertyBuilder).call(this));

        _this.data = (0, _utils.assign)({ propName: propName }, DEFAULT_DATA);
        return _this;
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

        /**
         * To hide the property name when using <code>Object.keys()</code>.
         * @returns {PropertyBuilder} the builder
         */

    }, {
        key: 'hidden',
        value: function hidden() {
            this.data.enumerable = false;
            return this;
        }

        /**
         * To set a default value.
         * @param {*} value the default value
         * @returns {PropertyBuilder} the builder
         */

    }, {
        key: 'value',
        value: function value(_value) {
            this.data.value = _value;
            return this;
        }

        /**
         * To set a getter function.
         * @param {function(el: HTMLElement): *} fn the getter function
         * @returns {PropertyBuilder} the builder
         */

    }, {
        key: 'getter',
        value: function getter(fn) {
            this.data.descriptorValue = false;
            this.data.getter = fn;
            return this;
        }

        /**
         * To set a setter function.
         * @param {function(el: HTMLElement, value: *)} fn the setter function
         * @returns {PropertyBuilder} the builder
         */

    }, {
        key: 'setter',
        value: function setter(fn) {
            this.data.descriptorValue = false;
            this.data.setter = fn;
            return this;
        }

        /**
         * @ignore
         */

    }, {
        key: 'build',
        value: function build(proto, on) {
            var _this2 = this;

            var data = this.data,
                defaultValue = (0, _utils.result)(this.data, 'value'),
                descriptor = {
                enumerable: this.data.enumerable
            };

            if (this.data.immutable) {
                descriptor.configurable = false;
                descriptor.writable = false;
            } else if ((0, _utils.isFunction)(this.data.getter) || (0, _utils.isFunction)(this.data.setter)) {
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
                if (!_this2.data.descriptorValue && !(0, _utils.isUndefined)(defaultValue)) {
                    el[data.propName] = defaultValue;
                }
            });
        }
    }]);

    return PropertyBuilder;
})(_Builder2.Builder);

exports.PropertyBuilder = PropertyBuilder;

},{"../utils.js":10,"./Builder.js":2}],8:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TemplateBuilder = undefined;
exports.applyTemplate = applyTemplate;

var _utils = require('../utils.js');

var _Builder2 = require('./Builder.js');

var _PropertyBuilder = require('./PropertyBuilder.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The counter is used to generate unique DOM's id.
 * @type {number}
 */
var counter = 0;

/**
 * The attribute name hosting the old light node id.
 * @type {string}
 */
var OLD_CONTENT_ID_ATTR_NAME = 'ceb-old-content-id';

/**
 * Regex to detect the *ceb-content* attributes.
 * @type {RegExp}
 */
var CONTENT_ATTR_REG_EX = /ceb\-content/im;

/**
 * Regex to detect the *content* element.
 * @type {RegExp}
 */
var CONTENT_NODE_REG_EX = /<content><\/content>/im;

/**
 * @param {!string} html the HTML template
 * @returns {boolean} true if the HTML template handle a light DOM node
 */
function hasContent(html) {
    return html.search(CONTENT_ATTR_REG_EX) !== -1 || html.search(CONTENT_NODE_REG_EX) !== -1;
}

/**
 * Update or replace an eventual content flag according to the given id.
 * @param {!string} html the HTML template
 * @param {!string} newCebContentId the new content node id
 * @returns {string} the updated HTML template
 */
function replaceContent(html, newCebContentId) {
    return html.replace('<content></content>', '<ceb-lightdom ceb-content></ceb-lightdom>').replace('ceb-content', newCebContentId);
}

/**
 * Try to find a light DOM node
 * @param {!HTMLElement} el the custom element
 * @returns {HTMLElement} the light DOM node if found otherwise it's the given HTML Element
 */
function findContentNode(el) {
    if (!el) {
        return;
    }
    var oldCebContentId = el.getAttribute(OLD_CONTENT_ID_ATTR_NAME);
    if (oldCebContentId) {
        return findContentNode(el.querySelector('[' + oldCebContentId + ']')) || el;
    }
    return el;
}

/**
 * Remove and return the children of the light DOM node.
 * @param {!HTMLElement} el the custom element
 * @returns {DocumentFragment} the light DOM fragment
 */
function cleanOldContentNode(el) {
    var oldContentNode = el.lightDom,
        lightFrag = document.createDocumentFragment();
    while (oldContentNode.childNodes.length > 0) {
        lightFrag.appendChild(oldContentNode.removeChild(oldContentNode.childNodes[0]));
    }
    return lightFrag;
}

/**
 * Add the given DOM nodes list to the given element.
 * @param {!HTMLElement} el the custom element
 * @param {DocumentFragment} lightFrag the light DOM fragment
 */
function fillNewContentNode(el, lightFrag) {
    el.lightDom.appendChild(lightFrag);
}

/**
 * Apply the template given by the property cebTemplate.
 * @param {!HTMLElement} el the custom element
 * @param {!string} tpl the template
 */
function applyTemplate(el, tpl) {
    var lightFrag = [],
        handleContentNode = hasContent(tpl);

    if (handleContentNode) {
        var newCebContentId = 'ceb-content-' + counter++;
        lightFrag = cleanOldContentNode(el);

        tpl = replaceContent(tpl, newCebContentId);

        el.setAttribute(OLD_CONTENT_ID_ATTR_NAME, newCebContentId);
    }

    el.innerHTML = tpl;

    if (handleContentNode) {
        fillNewContentNode(el, lightFrag);
    }
}
/**
 * The template builder.
 * Its goal is to provide a way to fill the content of a custom element.
 * @extends {Builder}
 */

var TemplateBuilder = exports.TemplateBuilder = (function (_Builder) {
    _inherits(TemplateBuilder, _Builder);

    /**
     * @param {!string|function(el: HTMLElement)} tpl the template as a string or a function
     */

    function TemplateBuilder(tpl) {
        _classCallCheck(this, TemplateBuilder);

        /**
         * @ignore
         */

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TemplateBuilder).call(this));

        _this.data = { tpl: tpl };
        return _this;
    }

    /**
     * @ignore
     */

    _createClass(TemplateBuilder, [{
        key: 'build',
        value: function build(proto, on) {
            var data = this.data;

            new _PropertyBuilder.PropertyBuilder('lightDom').getter(function (el) {
                return findContentNode(el);
            }).build(proto, on);

            on('before:createdCallback').invoke(function (el) {
                applyTemplate(el, (0, _utils.isFunction)(data.tpl) ? data.tpl(el) : data.tpl);
            });
        }
    }]);

    return TemplateBuilder;
})(_Builder2.Builder);

},{"../utils.js":10,"./Builder.js":2,"./PropertyBuilder.js":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Builder = undefined;
exports.ceb = ceb;
exports.property = property;
exports.attribute = attribute;
exports.method = method;
exports.delegate = delegate;
exports.template = template;
exports.on = on;

var _CustomElementBuilder = require('./builder/CustomElementBuilder.js');

var _PropertyBuilder = require('./builder/PropertyBuilder.js');

var _AttributeBuilder = require('./builder/AttributeBuilder.js');

var _DelegateBuilder = require('./builder/DelegateBuilder.js');

var _MethodBuilder = require('./builder/MethodBuilder.js');

var _TemplateBuilder = require('./builder/TemplateBuilder.js');

var _OnBuilder = require('./builder/OnBuilder.js');

var _Builder = require('./builder/Builder.js');

/**
 * The base builder type
 * @type {Builder} the builder
 */
var Builder = exports.Builder = _Builder.Builder;

/**
 * Get a new custom element builder.
 * @returns {CustomElementBuilder} the custom element builder
 */
function ceb() {
  return new _CustomElementBuilder.CustomElementBuilder();
}

/**
 * Get a new property builder.
 * @param {!string} propName the name of the property
 * @returns {PropertyBuilder} the property builder
 */
function property(propName) {
  return new _PropertyBuilder.PropertyBuilder(propName);
}

/**
 * Get a new attribute builder.
 * @param {!string} attrName the name of the attribute
 * @returns {AttributeBuilder} the attribute builder
 */
function attribute(attrName) {
  return new _AttributeBuilder.AttributeBuilder(attrName);
}
attribute.getAttValue = _AttributeBuilder.getAttValue;
attribute.setAttValue = _AttributeBuilder.setAttValue;

/**
 * Get a new method builder.
 * @param {!string} methName the name of the method
 * @returns {MethodBuilder} the method builder
 */
function method(methName) {
  return new _MethodBuilder.MethodBuilder(methName);
}

/**
 * Get a new delegate builder.
 * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} builder a property, attribute or method builder
 * @returns {DelegateBuilder} the delegate builder
 */
function delegate(builder) {
  return new _DelegateBuilder.DelegateBuilder(builder);
}

/**
 * Get a new template builder.
 * @param {!string|Function} tpl the string or function template
 * @returns {TemplateBuilder} the template builder
 */
function template(tpl) {
  return new _TemplateBuilder.TemplateBuilder(tpl);
}
template.applyTemplate = _TemplateBuilder.applyTemplate;

/**
 * Get a new on builder.
 * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
 * @returns {OnBuilder} the on builder
 */
function on(events) {
  return new _OnBuilder.OnBuilder(events);
}

},{"./builder/AttributeBuilder.js":1,"./builder/Builder.js":2,"./builder/CustomElementBuilder.js":3,"./builder/DelegateBuilder.js":4,"./builder/MethodBuilder.js":5,"./builder/OnBuilder.js":6,"./builder/PropertyBuilder.js":7,"./builder/TemplateBuilder.js":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.camelCase = camelCase;
exports.isFunction = isFunction;
exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isString = isString;
exports.isArray = isArray;
exports.result = result;
exports.assign = assign;
exports.toArray = toArray;
exports.flatten = flatten;
exports.invoke = invoke;
exports.partial = partial;
exports.bind = bind;
exports.noop = noop;
exports.find = find;
/**
 * @ignore
 */
function camelCase(value) {
    return value.toLowerCase().split('-').map(function (part, index) {
        return index ? part.charAt(0).toUpperCase() + part.slice(1) : part;
    }).join('');
}

/**
 * @ignore
 */
function isFunction(i) {
    return Object.prototype.toString.call(i) === '[object Function]';
}

/**
 * @ignore
 */
function isUndefined(i) {
    return i === undefined;
}

/**
 * @ignore
 */
function isNull(i) {
    return i === null;
}

/**
 * @ignore
 */
function isString(i) {
    return Object.prototype.toString.call(i) === '[object String]';
}

/**
 * @ignore
 */
function isArray(i) {
    return Object.prototype.toString.call(i) === '[object Array]';
}

/**
 * @ignore
 */
function result(obj, prop) {
    var value = obj[prop];
    return isFunction(value) ? value() : value;
}

/**
 * @ignore
 */
function assign() {
    return Array.prototype.reduce.call(arguments, function (target, source) {
        return Object.keys(Object(source)).reduce(function (target, key) {
            target[key] = source[key];
            return target;
        }, target);
    });
}

/**
 * @ignore
 */
function toArray(i) {
    return Array.prototype.slice.call(i);
}

/**
 * @ignore
 */
function flatten(array) {
    return array.reduce(function (a, b) {
        return isArray(b) ? a.concat(flatten(b)) : a.concat(b);
    }, []);
}

/**
 * @ignore
 */
function invoke() {
    var args = toArray(arguments),
        objects = args.shift(),
        meth = args.shift();
    if (isArray(objects)) {
        objects.filter(function (obj) {
            return isFunction(obj[meth]);
        }).forEach(function (obj) {
            return obj[meth].apply(obj, args);
        });
    }
}

/**
 * @ignore
 */
function partial() {
    var args = toArray(arguments),
        fn = args.shift();
    return function () {
        return fn.apply(this, args.concat(toArray(arguments)));
    };
}

/**
 * @ignore
 */
function bind(fn, ctx) {
    return function () {
        return fn.apply(ctx, toArray(arguments));
    };
}

/**
 * @ignore
 */
function noop() {
    return function () {};
}

/**
 * @ignore
 */
function find(array, cb) {
    return array.filter(cb)[0];
}

},{}]},{},[9])(9)
});