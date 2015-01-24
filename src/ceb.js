/* istanbul ignore next */
(function (g, factory) {
    /* globals module:0, define:0 */

    'use strict';

    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define('ceb', [], factory);
    } else {
        g.ceb = factory();
    }

}(this, function () {

    'use strict';

    var testing = {};

    /* TOOLS */

    function emptyFn() {
        return function () {};
    }
    testing.emptyFn = emptyFn;

    function listValues(object) {
        var o = object || {};
        return Object.getOwnPropertyNames(o).map(function (propName) {
            return o[propName];
        });
    }
    testing.listValues = listValues;

    // transform property notation to attribute notation
    function fromCamelCaseToHyphenCase(value) {
        return value.split(/(?=[A-Z])/).map(function (part) {
            return part.charAt(0).toLowerCase() + part.slice(1);
        }).join('-');
    }
    testing.fromCamelCaseToHyphenCase = fromCamelCaseToHyphenCase;

    function compareLevels(a, b) {
        return a.level > b.level;
    }
    testing.compareLevels = compareLevels;

    function applyAttributeValue(el, attName, value, isBoolean) {
        if (isBoolean) {
            if (value && !el.hasAttribute(attName)) {
                el.setAttribute(attName, '');
            } else if (!value && el.hasAttribute(attName)) {
                el.removeAttribute(attName);
            }
        } else {
            if ((value === null || value === undefined) && el.hasAttribute(attName)) {
                el.removeAttribute(attName);
            } else if ((value !== null && value !== undefined) && el.getAttribute(attName) !== value) {
                el.setAttribute(attName, value);
            }
        }
    }
    testing.applyAttributeValue = applyAttributeValue;

    function accessorFactory(wrappers, wrapped) {
        var stack = wrappers.sort(compareLevels);
        return function () {
            var el = this;
            return stack.reduce(function (previous, current) {
                return current.bind(el, previous, el);
            }, wrapped.bind(el, el)).apply(el, arguments);
        };
    }
    testing.accessorFactory = accessorFactory;

    function attributeAccessorSetFactory(attName, originalSet, isBoolean) {
        return function (el, value) {
            var attValue = value;
            if (originalSet) {
                attValue = originalSet.call(el, el, value);
            }
            applyAttributeValue(el, attName, attValue, isBoolean);
        };
    }
    testing.attributeAccessorSetFactory = attributeAccessorSetFactory;

    function attributeAccessorGetFactory(attName, originalGet, isBoolean) {
        return function (el) {
            var value = isBoolean ? el.hasAttribute(attName) : el.getAttribute(attName);
            if (originalGet) {
                value = originalGet.call(el, el, value);
            }
            return value;
        };
    }
    testing.attributeAccessorGetFactory = attributeAccessorGetFactory;

    function methodFactory(wrappers, wrapped) {
        var stack = wrappers.sort(compareLevels);
        return function () {
            var el = this;
            return stack.reduce(function (previous, current) {
                return current.bind(el, function next(args) {
                    var a = args || [];
                    return previous.apply(el, Array.prototype.slice.call(a).slice(2, a.length));
                }, el);
            }, wrapped.bind(el, el)).apply(el, arguments);
        };
    }
    testing.methodFactory = methodFactory;

    /* BUILD LIFE CYCLE */

    function sanitizeStructure(struct) {
        struct.prototype = struct.prototype || Object.create(HTMLElement.prototype);
        struct.features = struct.features || [];
        struct.interceptors = struct.interceptors || [];
        struct.wrappers = struct.wrappers || [];

        struct.methods = Object.assign({
            createdCallback: emptyFn(),
            attachedCallback: emptyFn(),
            detachedCallback: emptyFn(),
            attributeChangedCallback: emptyFn()
        }, struct.methods);
    }
    testing.sanitizeStructure = sanitizeStructure;

    function setupFeatures(struct) {
        var b = builder(struct.tagName, {
            struct: struct,
            registered: true
        });
        struct.features.sort(compareLevels).forEach(function (feature) {
            if (feature.fn && feature.fn.setup) {
                feature.fn.setup(struct, b, feature.options);
            }
        });
    }
    testing.setupFeatures = setupFeatures;

    function createAttributesHash(struct) {
        return listValues(struct.accessors).filter(function (accessor) {
            return accessor.attName;
        }).reduce(function (previous, current) {
            previous[current.attName] = current;
            return previous;
        }, {});
    }
    testing.createAttributesHash = createAttributesHash;

    function createDefinedPropertiesHash(struct) {
        return listValues(struct.accessors).map(function (accessor) {
            // default parameters
            var property = {
                configurable: false,
                enumerable: true
            };

            if (accessor.attribute) {
                // handle accessors linked to an attribute
                var originalSet = accessor.set;
                var originalGet = accessor.get;
                accessor.set = attributeAccessorSetFactory(accessor.attName, originalSet, !!accessor.attribute.boolean);
                accessor.get = attributeAccessorGetFactory(accessor.attName, originalGet, !!accessor.attribute.boolean);
            } else if (accessor.hasOwnProperty('value')) {
                // handle constants
                property.value = accessor.value;
                property.writable = accessor.hasOwnProperty('writable') ? accessor.writable : true;
            }

            if (!property.hasOwnProperty('writable')) {
                // handle setter and getter
                var interceptors = struct.interceptors[accessor.propName] || {};
                if (accessor.set) {
                    var setStack = interceptors.set || [];
                    property.set = accessorFactory(setStack, accessor.set);
                }
                if (accessor.get) {
                    var getStack = interceptors.get || [];
                    property.get = accessorFactory(getStack, accessor.get);
                }
            }

            return Object.assign(accessor, {
                property: property
            });
        }).reduce(function (previous, current) {
            previous[current.propName] = current.property;
            return previous;
        }, {});
    }
    testing.createDefinedPropertiesHash = createDefinedPropertiesHash;

    function createMethodsHash(struct) {
        return Object.getOwnPropertyNames(struct.methods).map(function (methName) {
            var stack = struct.wrappers[methName] || [];
            var fn = struct.methods[methName];
            return {
                methName: methName,
                fn: methodFactory(stack, fn)
            };
        }).reduce(function (previous, current) {
            previous[current.methName] = current.fn;
            return previous;
        }, {});
    }
    testing.createMethodsHash = createMethodsHash;

    /* BUILD */

    var build = function build(struct) {
        sanitizeStructure(struct);
        setupFeatures(struct);

        struct.definedProperties = createDefinedPropertiesHash(struct);
        struct.attributes = createAttributesHash(struct);
        struct.methods = createMethodsHash(struct);

        Object.defineProperties(struct.prototype, struct.definedProperties);
        Object.assign(struct.prototype, struct.methods);

        return document.registerElement(struct.tagName, struct);
    };
    testing.build = build;

    /* FEATURES */

    var builtInFeatures = {};
    testing.builtInFeatures = builtInFeatures;

    builtInFeatures.delegate = emptyFn();
    builtInFeatures.delegate.delegableAccessorInterceptor = function (accessor, next, el, value) {
        next(value);
        var target = el.querySelector(accessor.delegate.target);
        /* istanbul ignore else  */
        if (target) {
            var targetPropName = accessor.delegate.property;
            var targetAttName = accessor.delegate.attribute;
            if (!targetPropName && !targetAttName) {
                targetPropName = accessor.propName;
                targetAttName = accessor.attName;
            }
            var isBoolean = accessor.attribute && !!accessor.attribute.boolean;
            if (accessor.delegate.hasOwnProperty('boolean')) {
                isBoolean = accessor.delegate.boolean;
            }
            if (targetAttName) {
                applyAttributeValue(target, targetAttName, value, isBoolean);
            } else {
                target[targetPropName] = el[accessor.propName];
            }
        }
    };
    builtInFeatures.delegate.setup = function (struct, builder) {
        // keep only accessors configured for delegation
        listValues(struct.accessors).filter(function (accessor) {
            return accessor.delegate;
        }).forEach(function (accessor) {
            // intercept the setter
            var delegableAccessorInterceptor = builtInFeatures.delegate.delegableAccessorInterceptor;
            builder.intercept(accessor.propName, delegableAccessorInterceptor.bind(builtInFeatures.delegate, accessor));
        });
    };

    builtInFeatures.valueInitializer = emptyFn();
    builtInFeatures.valueInitializer.createdCallbackWrapper = function (struct, next, el) {
        next(arguments);
        listValues(struct.accessors).forEach(function (accessor) {
            if (accessor.attName) {
                if (el.hasAttribute(accessor.attName)) {
                    el[accessor.propName] = accessor.attribute.boolean ? true : el.getAttribute(accessor.attName);
                }
                if (accessor.hasOwnProperty('value')) {
                    applyAttributeValue(el, accessor.attName, accessor.value, accessor.attribute.boolean);
                }
            } else if (accessor.value && accessor.writable) {
                el[accessor.propName] = accessor.value;
            }
        });
    };
    builtInFeatures.valueInitializer.attributeChangedCallbackWrapper = function (struct, next, el, attName, oldVal, newVal) {
        var accessor = struct.attributes[attName];
        if (accessor) {
            var value = newVal;
            if (accessor.attribute.boolean) {
                value = typeof newVal === 'string' ? true : false;
            }
            el[accessor.propName] = value;
        }
        next(arguments);
    };
    builtInFeatures.valueInitializer.setup = function (struct, builder) {
        var createdCallbackWrapper = builtInFeatures.valueInitializer.createdCallbackWrapper;
        var attributeChangedCallbackWrapper = builtInFeatures.valueInitializer.attributeChangedCallbackWrapper;
        builder.wrap('createdCallback', createdCallbackWrapper.bind(builtInFeatures.valueInitializer, struct));
        builder.wrap('attributeChangedCallback', attributeChangedCallbackWrapper.bind(builtInFeatures.valueInitializer, struct));
    };

    /* BUILDER */

    function baseStructFactory() {
        return {
            accessors: {},
            methods: {},
            wrappers: [],
            interceptors: [],
            features: [{
                fn: builtInFeatures.delegate,
                level: -2
            }, {
                fn: builtInFeatures.valueInitializer,
                level: -1
            }]
        };
    }
    testing.baseStructFactory = baseStructFactory;

    function sanitizeProperty(property) {
        if (property.attribute) {
            property.attName = property.attribute.name || fromCamelCaseToHyphenCase(property.propName);
        }
        property.writable = property.hasOwnProperty('writable') ? property.writable : true;
        return property;
    }
    testing.sanitizeProperty = sanitizeProperty;

    var builder = function builder(tagName, params) {
        var struct = params && params.struct ? params.struct : baseStructFactory();
        struct.tagName = tagName;
        var registered = params && params.hasOwnProperty('registered') ? params.registered : false;
        var api = {};
        // WRAPPER
        api.wrap = function (methName, fn, level) {
            if (!struct.wrappers[methName]) {
                struct.wrappers[methName] = [];
            }
            fn.level = isNaN(level) ? 0 : level;
            struct.wrappers[methName].push(fn);
            return api;
        };
        api.intercept = function (propName, setFn, getFn, level) {
            if (!struct.interceptors[propName]) {
                struct.interceptors[propName] = {
                    set: [],
                    get: []
                };
            }
            if (setFn) {
                setFn.level = isNaN(level) ? 0 : level;
                struct.interceptors[propName].set.push(setFn);
            }
            if (getFn) {
                getFn.level = isNaN(level) ? 0 : level;
                struct.interceptors[propName].get.push(getFn);
            }
            return api;
        };
        // INTEGRATION
        api['extends'] = function (anExtend) {
            struct['extends'] = anExtend;
            return api;
        };
        api.prototype = function (aProto) {
            struct.prototype = aProto;
            return api;
        };
        // FELDS
        api.properties = function (someProperties) {

            var sanitizedProperties = Object.getOwnPropertyNames(someProperties || {}).map(function (propName) {
                return Object.assign(someProperties[propName], {
                    propName: propName
                });
            }).map(sanitizeProperty).reduce(function (previous, current) {
                previous[current.propName] = current;
                return previous;
            }, {});

            Object.assign(struct.accessors, sanitizedProperties);

            return api;
        };
        api.methods = function (someMethods) {
            Object.assign(struct.methods, someMethods);
            return api;
        };
        // FEATURES
        api.feature = function (fn, options, level) {
            struct.features.push({
                fn: fn,
                options: options,
                level: isNaN(level) ? 0 : level
            });
            return api;
        };
        api.register = function () {
            if (!registered) {
                registered = true;
                return build(struct);
            }
        };
        api.get = function () {
            return struct;
        };
        return api;
    };
    testing.builder = builder;

    function factory(params) {
        var api = {};
        api.start = function (tagName) {
            return builder(tagName, params);
        };
        return api;
    }
    factory._testing = testing;

    return factory;
}));
