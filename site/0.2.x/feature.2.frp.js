// This feature gets [Functional Reactive Programming](http://en.wikipedia.org/wiki/Functional_reactive_programming) to custom elements.
// Presently, properties can be observed and observers can be created from scratch.
//
// ## Integration
//
// Due too the number of good libraries implementing the FRP paradigm
// and because Custom Elements Builder is just a builder,
// this feature is not locked to an external dependencies.
//
// So, some functions must be overridden to handle the targeted FRP library.
// By default their implementation throw *not implemented*.
// Include [ceb-feature-frp-rx.js](../ceb-feature-frp-rx.html) to get an implementation based on Rx.
//
// The functions can be overridden from the feature's function:
// - cebFeatureFrp.propertyObserverFactory
// - cebFeatureFrp.propertyObservableInterceptor
// - cebFeatureFrp.disposeDisposable
//
// Or from the feature's options:
// - options.propertyObserverFactory
// - options.propertyObservableInterceptor
// - options.disposeDisposable
//
// To know more about their implementation, check the [annotated source](../ceb-feature-frp.html) of the feature.

// ## Observed properties

// To enable it, the property's structure must have the boolean **observable** to true.
ceb().name('observed-property').properties({
    prop1: {
        observable: true
    }
}).feature(cebFeatureFrp).register();

// Create a new observed-property.
var observedProperty = document.createElement('observed-property');
document.body.appendChild(observedProperty);

// `prop1Observer` is the observer of `prop1`
observedProperty.prop1Observer.distinctUntilChanged().subscribe(function(value) {
    console.log('the value');
});

// Will display *test* in the console.
observedProperty.prop1 = 'test';

// Will not display *test* in the console, due to the `distinctUntilChanged` condition.
observedProperty.prop1 = 'test';

// ## Disposable and factory

// The function feature provides a builder to help to create streams and subscribers according to the FRP library used.

// Usually streams are firstly created and subscribers come to play with the data by the way.
// When a stream is destroyed (disposed), all subscriptions are destroyed too.

// The goal of this builder is to create a function handling the logic for create stream and, if required, the
// subscriptions.
// Its returned object will be given to the `defaultDisposeObserver` when the element is detached.
// By default, the created function will return the stream unless the handlers factory returns something.
var aDisposableFactory = cebFeatureFrp
    // The method `disposable` start the builder, its argument is a callback with the element as argument.
    // The returned value of the callback must be ... disposable.
    .disposable(function(el) {
        return window.Rx.DOM.click(el.querySelector('button')).throttle(500);
    })
    // The method `handlers` is used to create subscribers for the freshly created disposable.
    // Its argument is a callback with the element and the disposable as arguments.
    // The returned value of the callback can be disposable.
    .handlers(function(el, disposable) {
        disposable.subscribe(function() {
            console.log(el.tagName, 'has been clicked!');
        });
    });

// Factory functions can be given as options in order to create streams from the current element.
ceb().name('disposable-factory').feature(cebFeatureFrp, {
    disposables: [aDisposableFactory]
}).register();
