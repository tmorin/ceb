(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ceb"] = factory();
	else
		root["ceb"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = isFunction;
exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isString = isString;
exports.isArray = isArray;
// obviously close to underscorejs and lodash ;)

/**
 * Checks if value is a Function object.
 * @param [value] the value to check
 * @return {boolean} true if value is a function, else false.
 */
function isFunction(value) {
  return Object.prototype.toString.call(value) === '[object Function]';
}

/**
 * Checks if value is undefined.
 * @param [value] the value to check
 * @return {boolean} true if value is undefined, else false.
 */
function isUndefined(value) {
  return value === undefined;
}

/**
 * Checks if value is null.
 * @param [value] the value to check
 * @return {boolean} true if value is null, else false.
 */
function isNull(value) {
  return value === null;
}

/**
 * Checks if value is a string.
 * @param [value] the value to check
 * @return {boolean} true if value is a string, else false.
 */
function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * Checks if value is an array.
 * @param [value] the value to check
 * @return {boolean} true if value is an array, else false.
 */
function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;
exports.toCamelCase = toCamelCase;
// obviously close to underscorejs and lodash ;)

/**
 * Converts value to an array.
 * @param [value] the value to convert
 * @returns {Array} the converted array
 */
function toArray(value) {
  return Array.prototype.slice.call(value);
}

/**
 * Converts string to camel case.
 * @param {string} [string=''] the string to convert
 * @return {string} the camel cased string
 */
function toCamelCase() {
  var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return string.toLowerCase().split('-').map(function (part, index) {
    return index ? part.charAt(0).toUpperCase() + part.slice(1) : part;
  }).join('');
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @interface
 */
var Builder = function () {
  function Builder() {
    _classCallCheck(this, Builder);
  }

  /**
   * Build execute the business logic of the builder.
   * @param {!Object} proto the builders
   * @param {!function} on the builders
   */


  _createClass(Builder, [{
    key: "build",
    value: function build(proto, on) {}
  }]);

  return Builder;
}();

exports.default = Builder;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.partial = partial;
exports.bind = bind;
exports.noop = noop;

var _converters = __webpack_require__(1);

/**
 * Partially apply a function by filling in any number of its arguments, without changing its dynamic this value.
 * @param {!Function} fn the function to partially apply arguments to
 * @param {...} args the arguments to be partially applied
 * @returns {Function} the new partially applied function
 */
function partial(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return function () {
        return fn.apply(this, args.concat((0, _converters.toArray)(arguments)));
    };
}

/**
 * Creates a function that invokes fn with context the context ctx.
 * @param {!Function} fn the function to bind
 * @param ctx the context
 * @returns {Function} the new bound function
 */
// obviously close to underscorejs and lodash ;)
function bind(fn, ctx) {
    return function () {
        return fn.apply(ctx, (0, _converters.toArray)(arguments));
    };
}

/**
 * An empty function doing nothing.
 * @returns {Function} a new function doing nothing
 */
function noop() {
    return function () {};
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.result = result;
exports.assign = assign;
exports.getSuper = getSuper;

var _types = __webpack_require__(0);

/**
 * Resolve the value of propName into object.
 * If the value is a function, it will be executed.
 * @param {!Object} object the object
 * @param {!string} propName the property name
 * @return the resolved value.
 */
function result(object, propName) {
    var value = object[propName];
    return (0, _types.isFunction)(value) ? value() : value;
}

/**
 * Assigns own enumerable properties of source object(s) to the destination object.
 * @param {!Object} destination the destination object
 * @param {...Object} [sources] the source objects
 * @returns {Object} the destination object
 */
// obviously close to underscorejs and lodash ;)
function assign(destination) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
    }

    return [destination].concat(sources).reduce(function (target, source) {
        return Object.keys(Object(source)).reduce(function (target, key) {
            target[key] = source[key];
            return target;
        }, target);
    });
}

/**
 * Get the prototype of the extended class.
 * @param object the object
 * @returns {Object} the prototype of the extended class
 */
function getSuper(object) {
    return Object.getPrototypeOf(Object.getPrototypeOf(object));
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AttributeBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getAttValue = getAttValue;
exports.setAttValue = setAttValue;
exports.attribute = attribute;

var _types = __webpack_require__(0);

var _objects = __webpack_require__(4);

var _converters = __webpack_require__(1);

var _Builder2 = __webpack_require__(2);

var _Builder3 = _interopRequireDefault(_Builder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        if (((0, _types.isUndefined)(value) || (0, _types.isNull)(value)) && el.hasAttribute(attrName)) {
            // There is no value, so the attribute must be removed
            el.removeAttribute(attrName);
        } else if (!(0, _types.isUndefined)(value) && !(0, _types.isNull)(value) && el.getAttribute(attrName) !== value) {
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

/**
 * The attribute builder.
 * Its goal is to provide a way to define an attribute.
 */

var AttributeBuilder = function (_Builder) {
    _inherits(AttributeBuilder, _Builder);

    /**
     * @param {!string} attrName the name of the attribute
     */
    function AttributeBuilder(attrName) {
        _classCallCheck(this, AttributeBuilder);

        /**
         * @ignore
         */
        var _this = _possibleConstructorReturn(this, (AttributeBuilder.__proto__ || Object.getPrototypeOf(AttributeBuilder)).call(this));

        _this.data = (0, _objects.assign)({
            attrName: attrName,
            propName: (0, _converters.toCamelCase)(attrName),
            listeners: []
        }, DEFAULT_DATA);
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
         * Logic of the builder.
         * @param {!ElementBuilder.context.p} proto the prototype
         * @param {!ElementBuilder.on} on the method on
         */

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
                // Synchronize the attribute value with its properties
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
}(_Builder3.default);

/**
 * Get a new attribute builder.
 * @param {!string} attrName the name of the attribute
 * @returns {AttributeBuilder} the attribute builder
 */


exports.AttributeBuilder = AttributeBuilder;
function attribute(attrName) {
    return new AttributeBuilder(attrName);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PropertyBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.property = property;

var _types = __webpack_require__(0);

var _objects = __webpack_require__(4);

var _Builder2 = __webpack_require__(2);

var _Builder3 = _interopRequireDefault(_Builder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 */

var PropertyBuilder = function (_Builder) {
    _inherits(PropertyBuilder, _Builder);

    /**
     * @param {!string} propName the name of the property
     */
    function PropertyBuilder(propName) {
        _classCallCheck(this, PropertyBuilder);

        /**
         * @ignore
         */
        var _this = _possibleConstructorReturn(this, (PropertyBuilder.__proto__ || Object.getPrototypeOf(PropertyBuilder)).call(this));

        _this.data = (0, _objects.assign)({ propName: propName, listeners: [] }, DEFAULT_DATA);
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
         * To be notified when the property is updated.
         * @param {function(el: HTMLElement, oldVal: *, newVal: *)} listener the listener function
         * @returns {PropertyBuilder} the builder
         */

    }, {
        key: 'listen',
        value: function listen(listener) {
            this.data.listeners.push(listener);
            return this;
        }

        /**
         * Logic of the builder.
         * @param {!ElementBuilder.context.p} proto the prototype
         * @param {!ElementBuilder.on} on the method on
         */

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
                        var _this2 = this;

                        var oldVal = this[_propName];
                        this[_propName] = newVal;
                        if (data.setter) {
                            data.setter.call(this, this, newVal);
                        }
                        data.listeners.forEach(function (listener) {
                            listener.call(_this2, _this2, oldVal, newVal);
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
}(_Builder3.default);

/**
 * Get a new property builder.
 * @param {!string} propName the name of the property
 * @returns {PropertyBuilder} the property builder
 */


exports.PropertyBuilder = PropertyBuilder;
function property(propName) {
    return new PropertyBuilder(propName);
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flatten = flatten;
exports.invoke = invoke;

var _types = __webpack_require__(0);

/**
 * Flattens a nested array.
 * @param {!Array} array the array to flatten
 * @returns {Array} the new flattened array
 */
function flatten(array) {
    return array.reduce(function (a, b) {
        return (0, _types.isArray)(b) ? a.concat(flatten(b)) : a.concat(b);
    }, []);
}

/**
 * For each objects, invoke the method called methName with the arguments args.
 * @param {!Array<Object>} objects the objects
 * @param {!string} methName the name of the method
 * @param {...*} args the arguments to invoke the method with
 * @return {Array} the array of results
 */
// obviously close to underscorejs and lodash ;)
function invoke(objects, methName) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    if ((0, _types.isArray)(objects)) {
        return objects.filter(function (obj) {
            return (0, _types.isFunction)(obj[methName]);
        }).map(function (obj) {
            return obj[methName].apply(obj, args);
        });
    }
    return [];
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DelegateBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.delegate = delegate;

var _types = __webpack_require__(0);

var _converters = __webpack_require__(1);

var _attribute = __webpack_require__(5);

var _Builder2 = __webpack_require__(2);

var _Builder3 = _interopRequireDefault(_Builder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The delegate builder.
 * Its goal is to provide a way to delegate methods, properties and attributes.
 */
var DelegateBuilder = exports.DelegateBuilder = function (_Builder) {
    _inherits(DelegateBuilder, _Builder);

    /**
     * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} fieldBuilder the field builder
     */
    function DelegateBuilder(fieldBuilder) {
        _classCallCheck(this, DelegateBuilder);

        /**
         * @ignore
         */
        var _this = _possibleConstructorReturn(this, (DelegateBuilder.__proto__ || Object.getPrototypeOf(DelegateBuilder)).call(this));

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
         * @param {!ElementBuilder.context.p} proto the prototype
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
                        targetValue = void 0;
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
                (function () {
                    var isNative = fieldBuilderData.native;
                    fieldBuilderData.native = false;
                    fieldBuilderData.invoke = function (el) {
                        var target = el.querySelector(data.selector);
                        if ((0, _types.isFunction)(target[targetedMethName])) {
                            var args = (0, _converters.toArray)(arguments);
                            if (!isNative) {
                                args.shift();
                            }
                            return target[targetedMethName].apply(target, args);
                        }
                    };
                })();
            }

            this.fieldBuilder.build(proto, on);
        }
    }]);

    return DelegateBuilder;
}(_Builder3.default);

/**
 * Get a new delegate builder.
 * @param {!PropertyBuilder|AttributeBuilder|MethodBuilder} builder a property, attribute or method builder
 * @returns {DelegateBuilder} the delegate builder
 */


function delegate(builder) {
    return new DelegateBuilder(builder);
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ElementBuilder = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.element = element;

var _types = __webpack_require__(0);

var _functions = __webpack_require__(3);

var _converters = __webpack_require__(1);

var _arrays = __webpack_require__(7);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LIFECYCLE_CALLBACKS = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];

var LIFECYCLE_EVENTS = (0, _arrays.flatten)(LIFECYCLE_CALLBACKS.map(function (name) {
    return ['before:' + name, 'after:' + name];
}));

function applyLifecycle(context, name) {
    var proto = context.p,
        original = proto[name],
        beforeFns = context.events['before:' + name],
        afterFns = context.events['after:' + name];

    proto[name] = function () {
        var _this = this;

        var args = (0, _converters.toArray)(arguments);
        if (args[0] != this) {
            args.unshift(this);
        }

        beforeFns.forEach(function (fn) {
            return fn.apply(_this, args);
        });

        if ((0, _types.isFunction)(original)) {
            original.apply(this, args);
        }

        afterFns.forEach(function (fn) {
            return fn.apply(_this, args);
        });
    };
}

/**
 * The custom element builder.
 * Its goal is to provide a user friendly way to build custom element by some else (i.e. dedicated builders).
 */

var ElementBuilder = function () {

    /**
     */
    function ElementBuilder() {
        _classCallCheck(this, ElementBuilder);

        var p = Object.create(HTMLElement.prototype),
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
         * @property {!Object} p - the prototype
         * @property {!string} e - the name of a native element
         * @property {!string} n - the name of a future element
         * @desc the context of the builder
         */
        this.context = { p: p, builders: builders, events: events };
    }

    /**
     * Set the basement of the future custom element, i.e. the prototype and/or the extends value.
     * Prototype and extends value can be swapped.
     * @example
     * element().base(prototypeValue, extendsValue);
     * element().base(extendsValue, prototypeValue);
     * element().base(extendsValue);
     * element().base(prototypeValue);
     * @param {!(string|Object)} arg1 the prototype or the name of the native element
     * @param {string|Object} [arg2] the prototype or the name of the native element
     * @returns {ElementBuilder} the builder
     */


    _createClass(ElementBuilder, [{
        key: 'base',
        value: function base(arg1, arg2) {
            var arg1Type = typeof arg1 === 'undefined' ? 'undefined' : _typeof(arg1);
            var p = arg1Type === 'string' ? arg2 : arg1;
            var e = arg1Type === 'string' ? arg1 : arg2;
            if (p) {
                this.context.p = p;
            }
            if (e) {
                this.context.e = e;
            }
            return this;
        }

        /**
         * To apply the given builders during the build process.
         * @param {...Builder} builders the builders
         * @returns {ElementBuilder} the builder
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
         * To register callbacks on events.
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

            this.context.n = name;
            this.context.events['before:builders'].forEach(function (fn) {
                return fn(_this4.context);
            });

            (0, _arrays.invoke)(this.context.builders, 'build', this.context.p, (0, _functions.bind)(this.on, this));

            this.context.events['after:builders'].forEach(function (fn) {
                return fn(_this4.context);
            });

            LIFECYCLE_CALLBACKS.forEach((0, _functions.partial)(applyLifecycle, this.context));

            this.context.events['before:registerElement'].forEach(function (fn) {
                return fn(_this4.context);
            });

            var CustomElement = void 0;

            if ((0, _types.isString)(this.context.e)) {
                CustomElement = document.registerElement(name, {
                    prototype: this.context.p,
                    extends: this.context.e
                });
            } else {
                CustomElement = document.registerElement(name, {
                    prototype: this.context.p
                });
            }

            this.context.events['after:registerElement'].forEach(function (fn) {
                return fn(CustomElement);
            });

            return CustomElement;
        }
    }]);

    return ElementBuilder;
}();

/**
 * Get a new custom element builder.
 * @returns {ElementBuilder} the custom element builder
 */


exports.ElementBuilder = ElementBuilder;
function element() {
    return new ElementBuilder();
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MethodBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.method = method;

var _types = __webpack_require__(0);

var _functions = __webpack_require__(3);

var _converters = __webpack_require__(1);

var _Builder2 = __webpack_require__(2);

var _Builder3 = _interopRequireDefault(_Builder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The method builder.
 * Its goal is to provide a way to define a method.
 */
var MethodBuilder = exports.MethodBuilder = function (_Builder) {
    _inherits(MethodBuilder, _Builder);

    /**
     * @param {!string} methName the name of the method
     */
    function MethodBuilder(methName) {
        _classCallCheck(this, MethodBuilder);

        /**
         * @ignore
         */
        var _this = _possibleConstructorReturn(this, (MethodBuilder.__proto__ || Object.getPrototypeOf(MethodBuilder)).call(this));

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
            if ((0, _types.isFunction)(fn)) {
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
         * Skip the custom element instance as first argument.
         * It's required when playing with native method with delegration or wrapping.
         * @returns {MethodBuilder} the builder
         */

    }, {
        key: 'native',
        value: function native() {
            this.data.native = true;
            return this;
        }

        /**
         * Logic of the builder.
         * @param {!ElementBuilder.context.p} proto the prototype
         * @param {!ElementBuilder.on} on the method on
         */

    }, {
        key: 'build',
        value: function build(proto, on) {
            var data = this.data;

            if (data.invoke) {
                proto[data.methName] = function () {
                    var args = (0, _converters.toArray)(arguments);
                    if (!data.native && args[0] != this) {
                        args.unshift(this);
                    }
                    return data.invoke.apply(this, args);
                };
            }

            if (data.wrappers.length) {
                on('before:createdCallback').invoke(function (el) {
                    if ((0, _types.isFunction)(el[data.methName])) {
                        (function () {
                            var lastIndex = data.wrappers.length - 1,
                                original = el[data.methName],
                                target = function target() {
                                var args = (0, _converters.toArray)(arguments);
                                if (!data.native) {
                                    args.shift();
                                }
                                original.apply(el, args);
                            };
                            el[data.methName] = data.wrappers.reduce(function (next, current, index) {
                                if (index === lastIndex) {
                                    return (0, _functions.bind)(data.native ? (0, _functions.partial)(current, next) : (0, _functions.partial)(current, next, el), el);
                                }
                                return (0, _functions.bind)((0, _functions.partial)(current, next), el);
                            }, target);
                        })();
                    }
                });
            }
        }
    }]);

    return MethodBuilder;
}(_Builder3.default);

/**
 * Get a new method builder.
 * @param {!string} methName the name of the method
 * @returns {MethodBuilder} the method builder
 */


function method(methName) {
    return new MethodBuilder(methName);
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OnBuilder = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.on = on;

var _types = __webpack_require__(0);

var _functions = __webpack_require__(3);

var _converters = __webpack_require__(1);

var _Builder2 = __webpack_require__(2);

var _Builder3 = _interopRequireDefault(_Builder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The on builder.
 * Its goal is to provide a way to listen events coming from the custom element.
 */
var OnBuilder = exports.OnBuilder = function (_Builder) {
    _inherits(OnBuilder, _Builder);

    /**
     * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
     */
    function OnBuilder(events) {
        _classCallCheck(this, OnBuilder);

        /**
         * @ignore
         */
        var _this = _possibleConstructorReturn(this, (OnBuilder.__proto__ || Object.getPrototypeOf(OnBuilder)).call(this));

        _this.data = { events: events, invoke: _functions.noop };
        return _this;
    }

    /**
     * To do something when events occurred.
     * The target argument is by default the custom element.
     * When the delegate feature is used, target is the matched element.
     * @param {!function(el: HTMLElement, evt: Event, target: HTMLElement)} fn the event's logic
     * @returns {OnBuilder} the builder
     */


    _createClass(OnBuilder, [{
        key: 'invoke',
        value: function invoke(fn) {
            if ((0, _types.isFunction)(fn)) {
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
         * Logic of the builder.
         * @param {!ElementBuilder.context.p} proto the prototype
         * @param {!ElementBuilder.on} on the method on
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
                el.__cebOnHandlers = [];
            });

            on('before:attachedCallback').invoke(function (el) {
                var listener = function listener(evt) {
                    if (selector) {
                        var target = (0, _converters.toArray)(el.querySelectorAll(selector)).filter(function (el) {
                            return el === evt.target || el.contains(evt.target);
                        })[0];
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

                el.__cebOnHandlers = events.map(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        name = _ref2[0],
                        target = _ref2[1];

                    return [name, target ? el.querySelector(target) : el];
                }).filter(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        name = _ref4[0],
                        target = _ref4[1];

                    return !!target;
                }).map(function (_ref5) {
                    var _ref6 = _slicedToArray(_ref5, 2),
                        name = _ref6[0],
                        target = _ref6[1];

                    return [target, name, listener, capture];
                }).concat(el.__cebOnHandlers);

                el.__cebOnHandlers.forEach(function (_ref7) {
                    var _ref8 = _slicedToArray(_ref7, 4),
                        target = _ref8[0],
                        name = _ref8[1],
                        listener = _ref8[2],
                        capture = _ref8[3];

                    return target.addEventListener(name, listener, capture);
                });
            });

            on('before:detachedCallback').invoke(function (el) {
                el.__cebOnHandlers.forEach(function (_ref9) {
                    var _ref10 = _slicedToArray(_ref9, 4),
                        target = _ref10[0],
                        name = _ref10[1],
                        listener = _ref10[2],
                        capture = _ref10[3];

                    return target.removeEventListener(name, listener, capture);
                });
                el.__cebOnHandlers = [];
            });
        }
    }]);

    return OnBuilder;
}(_Builder3.default);

/**
 * Get a new on builder.
 * @param {!string} events a list of tuple 'event target' separated by comas, the target is optional
 * @returns {OnBuilder} the on builder
 */


function on(events) {
    return new OnBuilder(events);
}

/**
 * Get a new on builder already setup with all mouse events: click, mousedown, mouseup, mouseover, mouseout, mousemove, contextmenu, dblclick.
 * @returns {OnBuilder}
 */
on.mouse = function () {
    return on('click, mousedown, mouseup, mouseover, mouseout, mousemove, contextmenu, dblclick');
};

/**
 * Get a new on builder already setup with all keyboard events: keydown, keypress, keyup.
 * @returns {OnBuilder}
 */
on.keyboard = function () {
    return on('keydown, keypress, keyup');
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TemplateBuilder = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.applyTemplate = applyTemplate;
exports.template = template;

var _types = __webpack_require__(0);

var _property = __webpack_require__(6);

var _Builder2 = __webpack_require__(2);

var _Builder3 = _interopRequireDefault(_Builder2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var oldContentNode = el.lightDOM,
        lightFrag = document.createDocumentFragment();
    while (oldContentNode.childNodes.length > 0) {
        lightFrag.appendChild(oldContentNode.removeChild(oldContentNode.childNodes[0]));
    }
    return lightFrag;
}

/**
 * Apply the template to the element.
 * @param {!HTMLElement} el the custom element
 * @param {!string} tpl the template
 */
function applyTemplate(el, tpl) {
    var lightFrag = void 0,
        handleContentNode = hasContent(tpl);

    if (handleContentNode) {
        var newCebContentId = 'ceb-content-' + counter++;
        lightFrag = cleanOldContentNode(el);

        tpl = replaceContent(tpl, newCebContentId);

        el.setAttribute(OLD_CONTENT_ID_ATTR_NAME, newCebContentId);
    }

    el.innerHTML = tpl;

    if (handleContentNode && lightFrag) {
        el.lightDOM.appendChild(lightFrag);
    }
}

/**
 * The template builder.
 * Its goal is to provide a way to fill the content of a custom element.
 */

var TemplateBuilder = exports.TemplateBuilder = function (_Builder) {
    _inherits(TemplateBuilder, _Builder);

    /**
     * @param {!string|function(el: HTMLElement)} tpl the template as a string or a function
     */
    function TemplateBuilder(tpl) {
        _classCallCheck(this, TemplateBuilder);

        /**
         * @ignore
         */
        var _this = _possibleConstructorReturn(this, (TemplateBuilder.__proto__ || Object.getPrototypeOf(TemplateBuilder)).call(this));

        _this.data = { tpl: tpl };
        return _this;
    }

    /**
     * Logic of the builder.
     * @param {!ElementBuilder.context.p} proto the prototype
     * @param {!ElementBuilder.on} on the method on
     */


    _createClass(TemplateBuilder, [{
        key: 'build',
        value: function build(proto, on) {
            var data = this.data;

            (0, _property.property)('lightDOM').getter(function (el) {
                return findContentNode(el);
            }).build(proto, on);

            on('before:createdCallback').invoke(function (el) {
                applyTemplate(el, (0, _types.isFunction)(data.tpl) ? data.tpl(el) : data.tpl);
            });
        }
    }]);

    return TemplateBuilder;
}(_Builder3.default);

/**
 * Get a new template builder.
 * @param {!string|function} tpl the string or function template
 * @returns {TemplateBuilder} the template builder
 */


function template(tpl) {
    return new TemplateBuilder(tpl);
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatchCustomEvent = dispatchCustomEvent;
exports.dispatchClonedEvent = dispatchClonedEvent;

var _objects = __webpack_require__(4);

var _types = __webpack_require__(0);

var CUSTOM_EVENT_ARG_NAMES = ['bubbles', 'cancelable', 'detail'];

var DEFAULT_CUSTOM_EVENT_OPTIONS = {
    bubbles: true,
    cancelable: true,
    detail: null
};

function createCustomEvent(eventType, options) {
    var event = void 0,
        args = (0, _objects.assign)({}, DEFAULT_CUSTOM_EVENT_OPTIONS, options);
    if (typeof CustomEvent === 'function') {
        event = new CustomEvent(eventType, args);
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent.apply(event, [eventType].concat(CUSTOM_EVENT_ARG_NAMES.map(function (name) {
            return args[name];
        })));
    }
    return event;
}

/**
 * Create and dispatch a custom event.
 * @param {!HTMLElement} el the element where the event will be dispatched
 * @param {!string} eventType the event type
 * @param {Object} [options] the options
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
function dispatchCustomEvent(el, eventType, options) {
    return el.dispatchEvent(createCustomEvent(eventType, options));
}

/**
 * Create and dispatch an event based on another one.
 * The properties of the base event not found into the new one will be copied.
 * @param el the element where the new event will be dispatched
 * @param inEvt the base event
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
function dispatchClonedEvent(el, inEvt) {
    var outEvt = createCustomEvent(inEvt.type, {
        bubbles: inEvt.bubbles,
        cancelable: inEvt.cancelable,
        view: inEvt.view,
        detail: inEvt
    });
    var keys = Object.keys(outEvt);
    Object.keys(inEvt).filter(function (k) {
        return !(0, _types.isFunction)(inEvt[k]);
    }).filter(function (k) {
        return keys.indexOf(k) < 0;
    }).forEach(function (k) {
        return outEvt[k] = inEvt[k];
    });
    return el.dispatchEvent(outEvt);
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__(9);

Object.defineProperty(exports, 'element', {
  enumerable: true,
  get: function get() {
    return _element.element;
  }
});

var _property = __webpack_require__(6);

Object.defineProperty(exports, 'property', {
  enumerable: true,
  get: function get() {
    return _property.property;
  }
});

var _attribute = __webpack_require__(5);

Object.defineProperty(exports, 'attribute', {
  enumerable: true,
  get: function get() {
    return _attribute.attribute;
  }
});
Object.defineProperty(exports, 'getAttValue', {
  enumerable: true,
  get: function get() {
    return _attribute.getAttValue;
  }
});
Object.defineProperty(exports, 'setAttValue', {
  enumerable: true,
  get: function get() {
    return _attribute.setAttValue;
  }
});

var _delegate = __webpack_require__(8);

Object.defineProperty(exports, 'delegate', {
  enumerable: true,
  get: function get() {
    return _delegate.delegate;
  }
});

var _method = __webpack_require__(10);

Object.defineProperty(exports, 'method', {
  enumerable: true,
  get: function get() {
    return _method.method;
  }
});

var _template = __webpack_require__(12);

Object.defineProperty(exports, 'template', {
  enumerable: true,
  get: function get() {
    return _template.template;
  }
});
Object.defineProperty(exports, 'applyTemplate', {
  enumerable: true,
  get: function get() {
    return _template.applyTemplate;
  }
});

var _on = __webpack_require__(11);

Object.defineProperty(exports, 'on', {
  enumerable: true,
  get: function get() {
    return _on.on;
  }
});

var _arrays = __webpack_require__(7);

Object.defineProperty(exports, 'flatten', {
  enumerable: true,
  get: function get() {
    return _arrays.flatten;
  }
});
Object.defineProperty(exports, 'invoke', {
  enumerable: true,
  get: function get() {
    return _arrays.invoke;
  }
});

var _converters = __webpack_require__(1);

Object.defineProperty(exports, 'toArray', {
  enumerable: true,
  get: function get() {
    return _converters.toArray;
  }
});
Object.defineProperty(exports, 'toCamelCase', {
  enumerable: true,
  get: function get() {
    return _converters.toCamelCase;
  }
});

var _functions = __webpack_require__(3);

Object.defineProperty(exports, 'bind', {
  enumerable: true,
  get: function get() {
    return _functions.bind;
  }
});
Object.defineProperty(exports, 'noop', {
  enumerable: true,
  get: function get() {
    return _functions.noop;
  }
});
Object.defineProperty(exports, 'partial', {
  enumerable: true,
  get: function get() {
    return _functions.partial;
  }
});

var _objects = __webpack_require__(4);

Object.defineProperty(exports, 'assign', {
  enumerable: true,
  get: function get() {
    return _objects.assign;
  }
});
Object.defineProperty(exports, 'result', {
  enumerable: true,
  get: function get() {
    return _objects.result;
  }
});
Object.defineProperty(exports, 'getSuper', {
  enumerable: true,
  get: function get() {
    return _objects.getSuper;
  }
});

var _events = __webpack_require__(13);

Object.defineProperty(exports, 'dispatchCustomEvent', {
  enumerable: true,
  get: function get() {
    return _events.dispatchCustomEvent;
  }
});
Object.defineProperty(exports, 'dispatchClonedEvent', {
  enumerable: true,
  get: function get() {
    return _events.dispatchClonedEvent;
  }
});

var _types = __webpack_require__(0);

Object.defineProperty(exports, 'isArray', {
  enumerable: true,
  get: function get() {
    return _types.isArray;
  }
});
Object.defineProperty(exports, 'isFunction', {
  enumerable: true,
  get: function get() {
    return _types.isFunction;
  }
});
Object.defineProperty(exports, 'isNull', {
  enumerable: true,
  get: function get() {
    return _types.isNull;
  }
});
Object.defineProperty(exports, 'isString', {
  enumerable: true,
  get: function get() {
    return _types.isString;
  }
});
Object.defineProperty(exports, 'isUndefined', {
  enumerable: true,
  get: function get() {
    return _types.isUndefined;
  }
});

/***/ })
/******/ ]);
});