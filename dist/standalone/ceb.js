(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ceb = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js', './PropertyBuilder.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'), require('./PropertyBuilder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils, global.PropertyBuilder);
        global.AttributeBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs, _PropertyBuilderJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    exports.getAttValue = getAttValue;
    exports.setAttValue = setAttValue;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    /**
     * Get the value from an attribute.
     * @param {!HTMLElement} el an HTML element
     * @param {!string} attrName the name of the attribute
     * @param {!boolean} isBoolean true is the returned value should be a boolean
     * @returns {string|boolean}
     */

    function getAttValue(el, attrName, isBoolean) {
        if (isBoolean) {
            //let value = el.getAttribute(attrName);
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
            if (((0, _utilsJs.isUndefined)(value) || (0, _utilsJs.isNull)(value)) && el.hasAttribute(attrName)) {
                // There is no value, so the attribute must be removed
                el.removeAttribute(attrName);
            } else if (!(0, _utilsJs.isUndefined)(value) && !(0, _utilsJs.isNull)(value) && el.getAttribute(attrName) !== value) {
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
            var attValue = (0, _utilsJs.isFunction)(attSetter) ? attSetter.call(el, el, value) : value;
            return setAttValue(el, attrName, isBoolean, attValue);
        };
    }

    /**
     * The attribute builder.
     * Its goal is to provide a way to define an attribute.
     * @extends {PropertyBuilder}
     */

    var AttributeBuilder = (function (_PropertyBuilder) {
        _inherits(AttributeBuilder, _PropertyBuilder);

        /**
         * @param {!string} attrName the name of the attribute
         */

        function AttributeBuilder(attrName) {
            _classCallCheck(this, AttributeBuilder);

            _get(Object.getPrototypeOf(AttributeBuilder.prototype), 'constructor', this).call(this, (0, _utilsJs.camelCase)(attrName));
            /**
             * @ignore
             */
            (0, _utilsJs.assign)(this.data, {
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
                    defaultValue = (0, _utilsJs.result)(this.data, 'value');

                this.data.value = undefined;

                this.data.getter = this.data.getterFactory(this.data.attrName, this.data.boolean, attGetter);
                this.data.setter = this.data.setterFactory(this.data.attrName, this.data.boolean, attSetter);

                _get(Object.getPrototypeOf(AttributeBuilder.prototype), 'build', this).call(this, proto, on);

                on('after:createdCallback').invoke(function (el) {
                    var attrValue = getAttValue(el, _this.data.attrName, _this.data.boolean);
                    if (_this.data.boolean) {
                        el[_this.data.propName] = !!defaultValue ? defaultValue : attrValue;
                    } else if (!(0, _utilsJs.isNull)(attrValue) && !(0, _utilsJs.isUndefined)(attrValue)) {
                        el[_this.data.propName] = attrValue;
                    } else if (!(0, _utilsJs.isUndefined)(defaultValue)) {
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
    })(_PropertyBuilderJs.PropertyBuilder);

    exports.AttributeBuilder = AttributeBuilder;
});

},{"../utils.js":10,"./PropertyBuilder.js":7}],2:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.Builder = mod.exports;
  }
})(this, function (exports) {
  /**
   * A builder is defined by a build method.
   * @abstract
   */
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Builder = (function () {
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

  exports.Builder = Builder;
});

},{}],3:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils);
        global.CustomElementBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var LIFECYCLE_CALLBACKS = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];

    var LIFECYCLE_EVENTS = (0, _utilsJs.flatten)(LIFECYCLE_CALLBACKS.map(function (name) {
        return ['before:' + name, 'after:' + name];
    }));

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
            key: 'extends',
            value: function _extends(value) {
                this.context['extends'] = value;
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
            key: 'augment',
            value: function augment() {
                var _this = this;

                for (var _len = arguments.length, builders = Array(_len), _key = 0; _key < _len; _key++) {
                    builders[_key] = arguments[_key];
                }

                builders.forEach(function (builder) {
                    return _this.context.builders.push(builder);
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
                var _this2 = this;

                var invoke = function invoke(cb) {
                    _this2.context.events[event].push(cb);
                    return _this2;
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
                var _this3 = this;

                this.context.events['before:builders'].forEach(function (fn) {
                    return fn(_this3.context);
                });

                (0, _utilsJs.invoke)(this.context.builders, 'build', this.context.proto, (0, _utilsJs.bind)(this.on, this));

                this.context.events['after:builders'].forEach(function (fn) {
                    return fn(_this3.context);
                });

                LIFECYCLE_CALLBACKS.forEach((0, _utilsJs.partial)(applyLifecycle, this.context));

                var options = { prototype: this.context.proto };

                if ((0, _utilsJs.isString)(this.context['extends'])) {
                    options['extends'] = this.context['extends'];
                }

                this.context.events['before:registerElement'].forEach(function (fn) {
                    return fn(_this3.context);
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

    function applyLifecycle(context, name) {
        var proto = context.proto,
            original = proto[name],
            beforeFns = context.events['before:' + name],
            afterFns = context.events['after:' + name];

        proto[name] = function () {
            var _this4 = this;

            var args = [this].concat((0, _utilsJs.toArray)(arguments));

            beforeFns.forEach(function (fn) {
                return fn.apply(_this4, args);
            });

            if ((0, _utilsJs.isFunction)(original)) {
                original.apply(this, args);
            }

            afterFns.forEach(function (fn) {
                return fn.apply(_this4, args);
            });
        };
    }
});

},{"../utils.js":10}],4:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js', './AttributeBuilder.js', './Builder.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'), require('./AttributeBuilder.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils, global.AttributeBuilder, global.Builder);
        global.DelegateBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs, _AttributeBuilderJs, _BuilderJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    /**
     * The delegate builder.
     * Its goal is to provide a way to delegate methods, properties and attributes.
     * @extends {Builder}
     */

    var DelegateBuilder = (function (_Builder) {
        _inherits(DelegateBuilder, _Builder);

        /**
         * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} fieldBuilder the field builder
         */

        function DelegateBuilder(fieldBuilder) {
            _classCallCheck(this, DelegateBuilder);

            _get(Object.getPrototypeOf(DelegateBuilder.prototype), 'constructor', this).call(this);
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
                if (!(0, _utilsJs.isUndefined)(propName)) {
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
                if (!(0, _utilsJs.isUndefined)(attrName)) {
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
                if (!(0, _utilsJs.isUndefined)(methName)) {
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
                        return function (el) {
                            var target = el.querySelector(data.selector);
                            if (target) {
                                return targetedAttrName ? (0, _AttributeBuilderJs.getAttValue)(target, targetedAttrName, isBoolean) : target[targetedPropName];
                            }
                        };
                    };
                    fieldBuilderData.setterFactory = function (attrName, isBoolean, attSetter) {
                        return function (el, value) {
                            var target = el.querySelector(data.selector),
                                attrValue = (0, _utilsJs.isFunction)(attSetter) ? attSetter.call(el, el, value) : value;
                            if (target) {
                                if (targetedAttrName) {
                                    (0, _AttributeBuilderJs.setAttValue)(target, targetedAttrName, isBoolean, attrValue);
                                } else {
                                    target[targetedPropName] = attrValue;
                                }
                                (0, _AttributeBuilderJs.setAttValue)(el, attrName, isBoolean, attrValue);
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
                        return (0, _utilsJs.isFunction)(fieldGetter) ? fieldGetter.call(el, el, targetValue) : targetValue;
                    };
                    fieldBuilderData.setter = function (el, value) {
                        var target = el.querySelector(data.selector),
                            targetValue = (0, _utilsJs.isFunction)(fieldSetter) ? fieldSetter.call(el, el, value) : value;
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
                        if ((0, _utilsJs.isFunction)(target[targetedMethName])) {
                            var args = (0, _utilsJs.toArray)(arguments);
                            args.shift();
                            return target[targetedMethName].apply(target, args);
                        }
                    };
                }

                this.fieldBuilder.build(proto, on);
            }
        }]);

        return DelegateBuilder;
    })(_BuilderJs.Builder);

    exports.DelegateBuilder = DelegateBuilder;
});

},{"../utils.js":10,"./AttributeBuilder.js":1,"./Builder.js":2}],5:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js', './Builder.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils, global.Builder);
        global.MethodBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs, _BuilderJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    /**
     * The method builder.
     * Its goal is to provide a way to define a method.
     * @extends {Builder}
     */

    var MethodBuilder = (function (_Builder) {
        _inherits(MethodBuilder, _Builder);

        /**
         * @param {!string} methName the name of the method
         */

        function MethodBuilder(methName) {
            _classCallCheck(this, MethodBuilder);

            _get(Object.getPrototypeOf(MethodBuilder.prototype), 'constructor', this).call(this);
            /**
             * @ignore
             */
            this.data = { methName: methName, invoke: _utilsJs.noop, wrappers: [] };
        }

        /**
         * To do something when invoked.
         * @param {!function(el: HTMLElement, args: ...*)} fn the method's logic
         * @returns {MethodBuilder} the builder
         */

        _createClass(MethodBuilder, [{
            key: 'invoke',
            value: function invoke(fn) {
                if ((0, _utilsJs.isFunction)(fn)) {
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

                proto[data.methName] = function () {
                    return data.invoke.apply(this, [this].concat((0, _utilsJs.toArray)(arguments)));
                };

                on('after:builders').invoke(function () {
                    data.wrappers.forEach(function (wrapper) {
                        return data.invoke = (0, _utilsJs.wrap)(data.invoke, wrapper);
                    });
                });
            }
        }]);

        return MethodBuilder;
    })(_BuilderJs.Builder);

    exports.MethodBuilder = MethodBuilder;
});

},{"../utils.js":10,"./Builder.js":2}],6:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js', './Builder.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'), require('./Builder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils, global.Builder);
        global.OnBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs, _BuilderJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    /**
     * The on builder.
     * Its goal is to provide a way to listen events coming from the custom element.
     * @extends {Builder}
     */

    var OnBuilder = (function (_Builder) {
        _inherits(OnBuilder, _Builder);

        /**
         * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
         */

        function OnBuilder(events) {
            _classCallCheck(this, OnBuilder);

            _get(Object.getPrototypeOf(OnBuilder.prototype), 'constructor', this).call(this);
            /**
             * @ignore
             */
            this.data = { events: events, invoke: _utilsJs.noop };
        }

        /**
         * To do something when events occurred.
         * The target arugment is by default the custom element.
         * When the delegate feature is used, target is the matched element.
         * @param {!function(el: HTMLElement, evt: DOMEvent, target: HTMLElement)} fn the event's logic
         * @returns {OnBuilder} the builder
         */

        _createClass(OnBuilder, [{
            key: 'invoke',
            value: function invoke(fn) {
                if ((0, _utilsJs.isFunction)(fn)) {
                    this.data.invoke = fn;
                }
                return this;
            }

            /**
             * To attach the event on the capture phase instread of on the bubble phase.
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
                            var target = (0, _utilsJs.find)((0, _utilsJs.toArray)(el.querySelectorAll(selector)), function (el) {
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
                        var _ref32 = _slicedToArray(_ref3, 2);

                        var name = _ref32[0];
                        var target = _ref32[1];
                        return !!target;
                    }).map(function (_ref4) {
                        var _ref42 = _slicedToArray(_ref4, 2);

                        var name = _ref42[0];
                        var target = _ref42[1];

                        target.addEventListener(name, listener, capture);
                        return [target, name, listener, capture];
                    });

                    el._cebOnHandlers.forEach(function (_ref5) {
                        var _ref52 = _slicedToArray(_ref5, 4);

                        var target = _ref52[0];
                        var name = _ref52[1];
                        var listener = _ref52[2];
                        var capture = _ref52[3];
                        return target.addEventListener(name, listener, capture);
                    });
                });

                on('before:detachedCallback').invoke(function (el) {
                    el._cebOnHandlers.forEach(function (_ref6) {
                        var _ref62 = _slicedToArray(_ref6, 4);

                        var target = _ref62[0];
                        var name = _ref62[1];
                        var listener = _ref62[2];
                        var capture = _ref62[3];
                        return target.removeEventListener(name, listener, capture);
                    });
                });
            }
        }]);

        return OnBuilder;
    })(_BuilderJs.Builder);

    exports.OnBuilder = OnBuilder;
});

},{"../utils.js":10,"./Builder.js":2}],7:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', './Builder.js', '../utils.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('./Builder.js'), require('../utils.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.Builder, global.utils);
        global.PropertyBuilder = mod.exports;
    }
})(this, function (exports, _BuilderJs, _utilsJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

            _get(Object.getPrototypeOf(PropertyBuilder.prototype), 'constructor', this).call(this);
            /**
             * @ignore
             */
            this.data = (0, _utilsJs.assign)({ propName: propName }, DEFAULT_DATA);
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
                var _this = this;

                var data = this.data,
                    defaultValue = (0, _utilsJs.result)(this.data, 'value'),
                    descriptor = {
                    enumerable: this.data.enumerable
                };

                if (this.data.immutable) {
                    descriptor.configurable = false;
                    descriptor.writable = false;
                } else if ((0, _utilsJs.isFunction)(this.data.getter) || (0, _utilsJs.isFunction)(this.data.setter)) {
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
                    if (!_this.data.descriptorValue && !(0, _utilsJs.isUndefined)(defaultValue)) {
                        el[data.propName] = defaultValue;
                    }
                });
            }
        }]);

        return PropertyBuilder;
    })(_BuilderJs.Builder);

    exports.PropertyBuilder = PropertyBuilder;
});

},{"../utils.js":10,"./Builder.js":2}],8:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', '../utils.js', './Builder.js', './PropertyBuilder.js'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('../utils.js'), require('./Builder.js'), require('./PropertyBuilder.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.utils, global.Builder, global.PropertyBuilder);
        global.TemplateBuilder = mod.exports;
    }
})(this, function (exports, _utilsJs, _BuilderJs, _PropertyBuilderJs) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    exports.applyTemplate = applyTemplate;

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        return html.replace('<content></content>', '<span ceb-content></span>').replace('ceb-content', newCebContentId);
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

    var TemplateBuilder = (function (_Builder) {
        _inherits(TemplateBuilder, _Builder);

        /**
         * @param {!string|function(el: HTMLElement)} tpl the template as a string or a function
         */

        function TemplateBuilder(tpl) {
            _classCallCheck(this, TemplateBuilder);

            _get(Object.getPrototypeOf(TemplateBuilder.prototype), 'constructor', this).call(this);
            /**
             * @ignore
             */
            this.data = { tpl: tpl };
        }

        /**
         * @ignore
         */

        _createClass(TemplateBuilder, [{
            key: 'build',
            value: function build(proto, on) {
                var data = this.data;

                new _PropertyBuilderJs.PropertyBuilder('lightDom').getter(function (el) {
                    return findContentNode(el);
                }).build(proto, on);

                on('before:createdCallback').invoke(function (el) {
                    applyTemplate(el, (0, _utilsJs.isFunction)(data.tpl) ? data.tpl(el) : data.tpl);
                });
            }
        }]);

        return TemplateBuilder;
    })(_BuilderJs.Builder);

    exports.TemplateBuilder = TemplateBuilder;
});

},{"../utils.js":10,"./Builder.js":2,"./PropertyBuilder.js":7}],9:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', './builder/CustomElementBuilder.js', './builder/PropertyBuilder.js', './builder/AttributeBuilder.js', './builder/DelegateBuilder.js', './builder/MethodBuilder.js', './builder/TemplateBuilder.js', './builder/OnBuilder.js', './builder/Builder.js'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('./builder/CustomElementBuilder.js'), require('./builder/PropertyBuilder.js'), require('./builder/AttributeBuilder.js'), require('./builder/DelegateBuilder.js'), require('./builder/MethodBuilder.js'), require('./builder/TemplateBuilder.js'), require('./builder/OnBuilder.js'), require('./builder/Builder.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.CustomElementBuilder, global.PropertyBuilder, global.AttributeBuilder, global.DelegateBuilder, global.MethodBuilder, global.TemplateBuilder, global.OnBuilder, global.Builder);
    global.ceb = mod.exports;
  }
})(this, function (exports, _builderCustomElementBuilderJs, _builderPropertyBuilderJs, _builderAttributeBuilderJs, _builderDelegateBuilderJs, _builderMethodBuilderJs, _builderTemplateBuilderJs, _builderOnBuilderJs, _builderBuilderJs) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ceb = ceb;
  exports.property = property;
  exports.attribute = attribute;
  exports.method = method;
  exports.delegate = delegate;
  exports.template = template;
  exports.on = on;

  /**
   * The base builder type
   * @type {Builder} the builder
   */
  var Builder = _builderBuilderJs.Builder;

  exports.Builder = Builder;
  /**
   * Get a new custom element builder.
   * @returns {CustomElementBuilder} the custom element builder
   */

  function ceb() {
    return new _builderCustomElementBuilderJs.CustomElementBuilder();
  }

  /**
   * Get a new property builder.
   * @param {!string} propName the name of the property
   * @returns {PropertyBuilder} the property builder
   */

  function property(propName) {
    return new _builderPropertyBuilderJs.PropertyBuilder(propName);
  }

  /**
   * Get a new attribute builder.
   * @param {!string} attrName the name of the attribute
   * @returns {AttributeBuilder} the attribute builder
   */

  function attribute(attrName) {
    return new _builderAttributeBuilderJs.AttributeBuilder(attrName);
  }

  attribute.getAttValue = _builderAttributeBuilderJs.getAttValue;
  attribute.setAttValue = _builderAttributeBuilderJs.setAttValue;

  /**
   * Get a new method builder.
   * @param {!string} methName the name of the method
   * @returns {MethodBuilder} the method builder
   */

  function method(methName) {
    return new _builderMethodBuilderJs.MethodBuilder(methName);
  }

  /**
   * Get a new delegate builder.
   * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} builder a property, attribute or method builder
   * @returns {DelegateBuilder} the delegate builder
   */

  function delegate(builder) {
    return new _builderDelegateBuilderJs.DelegateBuilder(builder);
  }

  /**
   * Get a new template builder.
   * @param {!string|Function} tpl the string or function template
   * @returns {TemplateBuilder} the template builder
   */

  function template(tpl) {
    return new _builderTemplateBuilderJs.TemplateBuilder(tpl);
  }

  template.applyTemplate = _builderTemplateBuilderJs.applyTemplate;

  /**
   * Get a new on builder.
   * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
   * @returns {OnBuilder} the on builder
   */

  function on(events) {
    return new _builderOnBuilderJs.OnBuilder(events);
  }
});

},{"./builder/AttributeBuilder.js":1,"./builder/Builder.js":2,"./builder/CustomElementBuilder.js":3,"./builder/DelegateBuilder.js":4,"./builder/MethodBuilder.js":5,"./builder/OnBuilder.js":6,"./builder/PropertyBuilder.js":7,"./builder/TemplateBuilder.js":8}],10:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.utils = mod.exports;
    }
})(this, function (exports) {
    /**
     * @ignore
     */
    'use strict';

    Object.defineProperty(exports, '__esModule', {
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
    exports.wrap = wrap;
    exports.find = find;
    exports.trigger = trigger;

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

    function wrap(fn, wrapper) {
        return partial(wrapper, fn);
    }

    /**
     * @ignore
     */

    function find(array, cb) {
        return array.filter(cb)[0];
    }

    /**
     * @ignore
     * TODO: handle legacy ways
     */

    function trigger(el, options, detail) {
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(options.name, options.bubbles, options.cancellable, detail);
        return el.dispatchEvent(evt);
    }
});

},{}]},{},[9])(9)
});