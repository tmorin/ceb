(function (g, factory) {
    /* globals module:0, define:0 */

    'use strict';

    /* istanbul ignore next */
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define('ceb', [], factory);
    } else {
        g.ceb = factory();
    }

}(this, function () {

    'use strict';

    /* TOOLS */

    function emptyFn() {
        return function () {};
    }

    function listValues(o) {
        return Object.getOwnPropertyNames(o).map(function (propName) {
            return o[propName];
        });
    }

    // transform property notation to attribute notation
    function fromCamelCaseToHyphenCase(value) {
        return value.split(/(?=[A-Z])/).map(function (part) {
            return part.charAt(0).toLowerCase() + part.slice(1);
        }).join('-');
    }

    function compareLevels(a, b) {
        return a.level - b.level;
    }

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

    function accessorFactory(wrappers, wrapped) {
        var stack = wrappers.sort(compareLevels);
        return function accessor() {
            var el = this;
            return stack.reduce(function (previous, current) {
                return current.bind(el, previous, el);
            }, wrapped.bind(el, el)).apply(el, arguments);
        };
    }

    function attributeAccessorSetFactory(attName, setter, isBoolean) {
        return function attributeAccessorSet(el, value) {
            var attValue = value;
            if (setter) {
                attValue = setter.call(el, el, value);
            }
            applyAttributeValue(el, attName, attValue, isBoolean);
        };
    }

    function attributeAccessorGetFactory(attName, getter, isBoolean) {
        return function attributeAccessorGet(el) {
            var value = isBoolean ? el.hasAttribute(attName) : el.getAttribute(attName);
            if (getter) {
                value = getter.call(el, el, value);
            }
            return value;
        };
    }

    function methodFactory(wrappers, wrapped) {
        var stack = wrappers.sort(compareLevels);
        return function () {
            var el = this;
            return stack.reduce(function (previous, current) {
                return current.bind(el, function next(args) {
                    return previous.apply(el, Array.prototype.slice.call(args).slice(2, args.length));
                }, el);
            }, wrapped.bind(el, el)).apply(el, arguments);
        };
    }

    /* BUILD LIFE CYCLE */

    function sanitizeStructure(struct) {
        struct.prototype = struct.prototype || Object.create(HTMLElement.prototype);
        struct.features = struct.features || [];
        struct.interceptors = struct.interceptors || [];
        struct.wrappers = struct.wrappers || [];
        struct.listeners = struct.listeners || [];
        struct.properties = struct.properties || {};
        struct.methods = Object.assign({
            createdCallback: emptyFn(),
            attachedCallback: emptyFn(),
            detachedCallback: emptyFn(),
            attributeChangedCallback: emptyFn()
        }, struct.methods);
        return struct;
    }

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

    function createAttributesHash(struct) {
        return listValues(struct.properties).filter(function (property) {
            return property.attName;
        }).reduce(function (previous, current) {
            previous[current.attName] = current;
            return previous;
        }, {});
    }

    function createDefinedPropertiesHash(struct) {
        return listValues(struct.properties).map(function (property) {
            // default parameters
            var definedProperty = {
                configurable: false,
                enumerable: true
            };

            if (property.attribute) {
                // handle properties linked to an attribute
                property.set = attributeAccessorSetFactory(property.attName, property.setter, !!property.attribute.boolean);
                property.get = attributeAccessorGetFactory(property.attName, property.getter, !!property.attribute.boolean);
            } else if (property.hasOwnProperty('value') && property.hasOwnProperty('writable') && !property.writable) {
                // handle constants
                definedProperty.value = property.value;
                definedProperty.writable = false;
            } else if (!property.set && !property.get) {
                definedProperty.writable = true;
            }

            if (!definedProperty.hasOwnProperty('writable')) {
                // handle setter and getter
                var interceptors = struct.interceptors[property.propName] || {};
                if (property.set) {
                    var setStack = interceptors.set || [];
                    definedProperty.set = accessorFactory(setStack, property.set);
                }
                if (property.get) {
                    var getStack = interceptors.get || [];
                    definedProperty.get = accessorFactory(getStack, property.get);
                }
            }

            return Object.assign(property, {
                property: definedProperty
            });
        }).reduce(function (previous, current) {
            previous[current.propName] = current.property;
            return previous;
        }, {});
    }

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

    /* Built-in feature */

    function delegableSetAccessorInterceptor(property, next, el, value) {
        next(value);
        var target = el.querySelector(property.delegate.target);
        /* istanbul ignore else  */
        if (target) {
            var targetPropName = property.delegate.property;
            var targetAttName = property.delegate.attribute;
            if (!targetPropName && !targetAttName) {
                targetPropName = property.propName;
                targetAttName = property.attName;
            }
            var isBoolean = property.attribute && !!property.attribute.boolean;
            if (property.delegate.hasOwnProperty('boolean')) {
                isBoolean = property.delegate.boolean;
            }
            if (targetAttName) {
                applyAttributeValue(target, targetAttName, value, isBoolean);
            } else {
                target[targetPropName] = value;
            }
        }
    }

    function delegableGetAccessorInterceptor(property, next, el, value) {
        var result = next(value);
        var target = el.querySelector(property.delegate.target);
        /* istanbul ignore else  */
        if (target) {
            var targetPropName = property.delegate.property;
            var targetAttName = property.delegate.attribute;
            if (!targetPropName && !targetAttName) {
                targetPropName = property.propName;
                targetAttName = property.attName;
            }
            var isBoolean = property.attribute && !!property.attribute.boolean;
            if (property.delegate.hasOwnProperty('boolean')) {
                isBoolean = property.delegate.boolean;
            }
            if (targetAttName) {
                result = isBoolean ? target.hasAttribute(targetAttName) : target.getAttribute(targetAttName);
            } else {
                result = target[targetPropName];
            }
        }
        return result;
    }

    function eventListener(el, fn, evt) {
        fn(el, evt);
    }

    var builtInFeature = emptyFn();
    builtInFeature.setup = function (struct, builder) {
        // keep only properties configured for delegation
        listValues(struct.properties).filter(function (property) {
            return property.delegate;
        }).forEach(function (property) {
            // intercept the setter
            if (!property.attName) {
                property.set = property.set || emptyFn();
                property.get = property.get || emptyFn();
            }
            builder.intercept(
                property.propName,
                delegableSetAccessorInterceptor.bind(this, property),
                delegableGetAccessorInterceptor.bind(this, property)
            );
        });
        builder.wrap('createdCallback', function (next, el) {
            // initialize properties values
            listValues(struct.properties).forEach(function (property) {
                if (property.attName) {
                    if (el.hasAttribute(property.attName)) {
                        el[property.propName] = property.attribute.boolean ? true : el.getAttribute(property.attName);
                    } else if (property.hasOwnProperty('value')) {
                        applyAttributeValue(el, property.attName, property.value, property.attribute.boolean);
                    }
                } else if (property.hasOwnProperty('value') && property.writable) {
                    el[property.propName] = property.value;
                }
            });
            next(arguments);
        });
        builder.wrap('attachedCallback', function (next, el) {
            next(arguments);
            // listen events
            el.__eventHandlers = struct.listeners.map(function (listener) {
                var target = listener.target ? el.querySelector(listener.target) : el;
                var callback = eventListener.bind(el, el, listener.fn);
                target.addEventListener(listener.event, callback, true);
                return {
                    event: listener.event,
                    target: target,
                    callback: callback
                };
            });
        });
        builder.wrap('detachedCallback', function (next, el) {
            // release event handlers
            el.__eventHandlers.forEach(function (handler) {
                handler.target.removeEventListener(handler.event, handler.callback, true);
            });
            el.__eventHandlers = null;
            next(arguments);
        });
        builder.wrap('attributeChangedCallback', function (next, el, attName, oldVal, newVal) {
            // sync the attribute value with the property value
            var property = struct.attributes[attName];
            if (property) {
                var value = newVal;
                if (property.attribute.boolean) {
                    value = typeof newVal === 'string' ? true : false;
                }
                el[property.propName] = value;
            }
            next(arguments);
        });
    };

    /* BUILDER */

    function baseStructFactory() {
        return {
            properties: {},
            methods: {},
            wrappers: [],
            interceptors: [],
            listeners: [],
            features: [{
                fn: builtInFeature
            }]
        };
    }

    function sanitizeProperty(property) {
        if (property.attribute) {
            property.attName = property.attribute.name || fromCamelCaseToHyphenCase(property.propName);
        }
        property.writable = property.hasOwnProperty('writable') ? property.writable : true;
        return property;
    }

    var builder = function builder(tagName, params) {
        var struct = params && params.struct ? sanitizeStructure(params.struct) : baseStructFactory();
        struct.tagName = tagName;
        var registered = params && params.hasOwnProperty('registered') ? params.registered : false;
        var api = {};
        // Wrappers and intercetpors
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

            var sanitizedProperties = Object.getOwnPropertyNames(someProperties).map(function (propName) {
                return Object.assign(someProperties[propName], {
                    propName: propName
                });
            }).map(sanitizeProperty).reduce(function (previous, current) {
                previous[current.propName] = current;
                return previous;
            }, {});

            Object.assign(struct.properties, sanitizedProperties);

            return api;
        };
        api.methods = function (someMethods) {
            Object.assign(struct.methods, someMethods);
            return api;
        };
        // Events
        api.listen = function (queries, fn) {
            queries.trim().split(',').map(function (query) {
                var parts = query.trim().split(' ');
                return {
                    event: parts[0].trim(),
                    target: (parts[1] || '').trim(),
                    fn: fn
                };
            }).forEach(function (listener) {
                struct.listeners.push(listener);
            });
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

    function factory(params) {
        var api = {};
        api.name = function (tagName) {
            return builder(tagName, params);
        };
        return api;
    }

    return factory;
}));
