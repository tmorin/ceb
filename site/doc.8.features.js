// Get a builder.
'use strict';
var builder = ceb().name('featured-tag');

// ## The needs

// Custom Elements are, at the end, objects.
// So, they can inherit from another element (i.e. [Extends and prototype]),
// This relation is vertical and one element can only inherit from another one.

// Due to the dynamic part of JavaScript, the [mixin way] can be used to share functionalities.
// This new relation is horizontal and allows one object to be enhanced with others.
// However, this merging process overrides the properties and methods of the initial object.
// [mixin way]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
// [Extends and prototype]:doc.2.inheritance.html

// The *interceptors* and *wrappers* provided by **ceb** resolve the side effect of overriding.
// They act as an horizontal relations keeping alive the originals properties and methods.

// The features are containers of functionalities.
// They provide to custom elements where they are applied their functionalities.

// ## Features

// A feature is a simple function taking only one argument: the element instance.
// This function is, for a custom element, the public API of the feature.

// However, a function *setup* can be attached to the feature's function.
// It will be called by **ceb** before the full process of the structure.
// That's mean the function *setup* can have access to the whole structure of future custom element.
// Moreover, a builder is given to this function, allowing feature to adds stuff to the structure.

// The following feature will handle a placeholder.
// The placeholder will be displayed according to the attributes placeholder-value and placeholder-target.
// By default the target is the element instance.

// There is no public API provided by the feature's function.
function placeholderFeature() {}

// The setup function is called with three arguments
// - struct: the current structure
// - featureBuilder: a builder based on the current structure
// - options: the options given when the feature has been added to the structure
placeholderFeature.setup = function (struct, featureBuilder, options) {

    // Check from the options if the native placeholder should be used.
    var native = options.hasOwnProperty('native') ? options.native : false;

    // This function is an interceptor.
    // The goal of this interceptor is to update the UI according to the value set.
    // That's means, just after the write of the value, the UI must be updated.
    function writeInterceptor(next, el, value) {
        // call the original set accessor in order to update the DOM's attributes.
        var result = next(value);

        // There, the DOM attribute has been written,
        // so <code>el.placeholderValue === value</code>
        // or <code>el.placeholderTarget === value</code>

        // Detect the target according to the value of placeholderTarget.
        var target = el.placeholderTarget ? el.querySelector(el.placeholderTarget) : el;

        if (native) {

            // The previous target is cleaned, because the target can change at any time.
            if (el.__placeholderTarget && el.__placeholderTarget.hasAttribute('placeholder')) {
                el.__placeholderTarget.removeAttribute('placeholder');
                delete el.__placeholderTarget;
            }

            // Display the placeholder using the native attribute,
            // and keep a reference of the DOM node which will be cleaned.
            if (el.placeholderValue) {
                target.setAttribute('placeholder', el.placeholderValue);
                el.__placeholderTarget = target;
            }

        } else {

            // The previous jquery's plugin is destroyed, because the target can change at any time.
            if (el.__$placeholderTarget) {
                el.__$placeholderTarget.placeholder('destroy');
                delete el.__$placeholderTarget;
            }

            // Display the placeholder using a dedicated jquery plugin,
            // and keep a reference of jquery instance in order to destroy it.
            if (el.placeholderValue) {
                el.__$placeholderTarget = window.$(target).placeholder({
                    value: el.placeholderValue
                });
            }

        }

        return result;
    }

    // Defined the two properties of the features.
    featureBuilder.properties({
        placeholderValue: {
            attribute: true
        },
        placeholderTarget: {
            attribute: true
        }
    });

    // Intercept the property placeholderValue and placeholderTarget to update the UI on the fly.
    featureBuilder.intercept('placeholderValue', writeInterceptor).intercept('placeholderTarget', writeInterceptor);

    // When the element is detached, the jquery plugin must be destroy to avoid memory leak.
    featureBuilder.wrap('detachedCallback', function (next, el) {
        if (el.__$placeholderTarget) {
            el.__$placeholderTarget.placeholder('destroy');
            delete el.__$placeholderTarget;
        }
        next(arguments);
    });

    // So, when the element is attached, the jquery plugin must be created if the element has just been cloned.
    featureBuilder.wrap('attachedCallback', function (next, el) {
        next(arguments);
        var target = el.placeholderTarget ? el.querySelector(el.placeholderTarget) : el;
        if (!native && el.placeholderValue) {
            el.__$placeholderTarget = window.$(target).placeholder({
                value: el.placeholderValue
            });
        }
    });

};

// The builder’s method feature adds the given feature to the structure.
// The first argument is the feature's function.
// The second argument is the feature's options.
builder.feature(placeholderFeature, {
    native: true
});
