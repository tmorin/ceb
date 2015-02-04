(function (g, factory) {
    'use strict';

    // Export the **ceb-feature-frp** function according the detected loader.

    /* istanbul ignore next */
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define('ceb-feature-bind', [], factory);
    } else {
        g.cebFeatureBind = factory();
    }

}(this, function () {
    'use strict';

    /* istanbul ignore next */
    if (!('assign' in Object)) {
        /* https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js */
        Object.defineProperty(Object, 'assign', {
            configurable: true,
            enumerable: false,
            writable: true,
            value: function polyfillAssign() {
                return Array.prototype.reduce.call(arguments, function (target, source) {
                    return Object.keys(Object(source)).reduce(function (target, key) {
                        target[key] = source[key];
                        return target;
                    }, target);
                });
            }
        });
    }

    function feature(el) {
        var view;
        if (!el.__cebBindScope) {
            el.__cebBindScope = {};
        }
        return {
            scope: function () {
                return el.__cebBindScope;
            },
            bind: function (boundProperties, options) {
                console.log(el.tagName, 'bind', boundProperties, el.__cebBindScope.code);
                var bind = options.bindEl || feature.bindEl;
                view = bind(el, el.__cebBindScope, Object.assign({}, feature.options, options));
            },
            unbind: function (options) {
                var unbind = options.unbindEl || feature.unbindEl;
                console.log(el.tagName, 'unbind');
                unbind(el, view);
            }
        };
    }

    feature.options = {};

    feature.bindEl = function defaultBindEl(el, scope, options) {
        throw new Error('not implemented!');
    };

    feature.unbindEl = function defaultUnbindEl(el, view) {
        throw new Error('not implemented!');
    };

    function emptyFn() {
        return function () {};
    }

    function boundPropertySetInterceptor(next, el, propName, value) {
        next(value);
        feature(el).scope()[propName] = value;
    }

    function boundPropertyGetInterceptor(next, el, propName) {
        //var result = next();
        //feature(el).scope()[propName] = result;
        return feature(el).scope()[propName];
    }

    feature.setup = function (struct, builder, options) {
        var boundProperties = Object.keys(struct.properties).map(function (propName) {
            return {
                propName: propName,
                property: struct.properties[propName]
            };
        }).filter(function (entry) {
            return entry.property.bound;
        }).map(function (entry) {

            if (!entry.property.attName && !entry.property.set) {
                entry.property.set = emptyFn();
            }
            if (!entry.property.attName && !entry.property.get) {
                entry.property.get = emptyFn();
            }

            builder.intercept(
                entry.propName,
                boundPropertySetInterceptor,
                boundPropertyGetInterceptor
            );

            return entry.propName;
        });

        builder.wrap('attachedCallback', function (next, el) {
            next(arguments);
            feature(el).bind(boundProperties, options);
        }, Number.MAX_VALUE);

        builder.wrap('detachedCallback', function (next, el) {
            next(arguments);
            feature(el).unbind(options);
        }, Number.MAX_VALUE);

    };

    return feature;
}));
