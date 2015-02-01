// # ceb-feature-frp.js
//
// **NOT YET RELEASED**
//
// This feature gets Functional Reactive Programming to custom elements.
// Presently, properties can be observed and observers can be created from scratch.
//
// ## Integration
//
// Due too the number of good libraries implementing the FRP paradigm
// and because Custom Elements Builder is just a builder,
// this feature is not locked to an external dependencies.
//
// So, some functions should be overridden to handle the targetted FRP librairy.
// By default their implementation is locked to `window.Rx`.
//
// The functions can be overridden from the function feature:
// - cebFeatureFrp.defaultPropertyObserverFactory
// - cebFeatureFrp.defaultPropertyObservableInterceptor
// - cebFeatureFrp.defaultDisposeObserver
//
// Or from the feature's options:
// - options.propertyObserverFactory
// - options.propertyObservableInterceptor
// - options.disposeObserver
//
// ## Observed properties
//
// The observers of observed properties can be get from `myPropObserver`.
//
// To enable it, the property's structure must have the boolean **observable** to true.
//
// ## Observers
//
// Factory functions can be given as options in order to create observers from the current elements.
//
//     options.observer = [observerFactory]
//
// Where observerFactory is a function having the element as arguement.
(function (g, factory) {
    'use strict';

    /* istanbul ignore next */
    if (typeof exports === 'object') {
        module.exports = factory(require('ceb'));
    } else if (typeof define === 'function' && define.amd) {
        define('ceb-feature-template', ['ceb'], factory);
    } else {
        g.cebFeatureFrp = factory(g.ceb);
    }

}(this, function (ceb) {
    'use strict';

    // ## feature function

    // The FRP feature's function returns nothing for public API.
    function feature(el) {
        if (!el.__cebFrpScope) {
            el.__cebFrpScope = {};
        }
        return el.__cebFrpScope;
    }

    // ## Default functions

    // This function must returns the instance to the property observer.
    // > @param el (HTMLElement) the current element
    feature.defaultPropertyObserverFactory = function defaultPropertyObserverFactory() {
        return new window.Rx.Subject();
    };

    // When the observed property is set, the value must be pushed into the stream.
    // > @param next (function) will call the next stacked callback
    // > @param el (HTMLElement) the current element
    // > @param propName (string) the name of the observed property
    // > @param value (*) the value of the previous stacked callback
    feature.defaultPropertyObservableInterceptor = function defaultPropertyObservableInterceptor(next, el, propName, value) {
        next(value);
        el[propName + 'Observer'].onNext(value);
    };

    // This function must clear the observer instance given as argument.
    // > @param observer (object) the observer to kick
    feature.defaultDisposeObserver = function defaultDisposeObserver(observer) {
        observer.dispose();
    };

    // ## Setup

    feature.setup = function (struct, builder, options) {
        var observerProperties = {};

        // Resolve the locked functions.
        var propertyObserverFactory = options.propertyObserverFactory || feature.defaultPropertyObserverFactory;
        var propertyObservableInterceptor = options.propertyObservableInterceptor || feature.defaultPropertyObservableInterceptor;
        var disposeObserver = options.disposeObserver || feature.defaultDisposeObserver;

        // Iterate over the structure's properties in order to detect the observable properties.
        Object.keys(struct.properties).map(function (propName) {
            return {
                propName: propName,
                property: struct.properties[propName]
            };
        }).filter(function (entry) {
            return entry.property.observable;
        }).forEach(function (entry) {
            // Create the observer property of the observed property.
            observerProperties[entry.propName + 'Observer'] = {
                valueFactory: propertyObserverFactory
            };
            // Register the interceptor which will sync the observer with the property's value.
            builder.intercept(entry.propName, propertyObservableInterceptor);
        });

        // Add the new properties to the structure.
        builder.properties(observerProperties);

        builder.wrap('createdCallback', function (next, el) {
            next(arguments);
            // When the element is created the observers must created.
            if (!feature(el).observers) {
                feature(el).observers = (options.observers || []).map(function (observerFactory) {
                    return observerFactory(el);
                });
            }
        });

        builder.wrap('attachedCallback', function (next, el) {
            // When the element is attached the observers of properties must be available ...
            Object.keys(observerProperties).forEach(function (propName) {
                if (!el[propName]) {
                    el[propName] = propertyObserverFactory(el);
                }
            });
            // ... and the others observers too.
            if (!feature(el).observers) {
                feature(el).observers = (options.observers || []).map(function (observerFactory) {
                    return observerFactory(el);
                });
            }
            next(arguments);
        });

        builder.wrap('detachedCallback', function (next, el) {
            next(arguments);
            // When the element is detached the observers of properties must be disposed ...
            Object.keys(observerProperties).forEach(function (propName) {
                disposeObserver(el[propName]);
                el[propName] = undefined;
            });
            // ... and the others observers too.
            feature(el).observers.forEach(disposeObserver);
            feature(el).observers = null;
        });
    };

    return feature;
}));
