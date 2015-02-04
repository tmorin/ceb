(function (g, factory) {
    'use strict';

    // Export the **ceb-feature-frp-rx** function according the detected loader.

    /* istanbul ignore next */
    if (typeof exports === 'object') {
        module.exports = factory(require('ceb-feature-frp'), require('Rx'));
    } else if (typeof define === 'function' && define.amd) {
        define('ceb-feature-frp-rx', ['ceb-feature-frp', 'Rx'], factory);
    } else {
        g.cebFeatureFrp = factory(g.cebFeatureFrp, g.Rx);
    }

}(this, function (cebFeatureFrp, Rx) {
    'use strict';

    cebFeatureFrp.propertyObserverFactory = function rxPropertyObserverFactory() {
        return new Rx.Subject();
    };

    cebFeatureFrp.propertyObservableInterceptor = function rxPropertyObservableInterceptor(next, el, propName, value) {
        next(value);
        el[propName + 'Observer'].onNext(value);
    };

    cebFeatureFrp.disposeDisposable = function rxDisposeDisposable(observer) {
        observer.dispose();
    };

    return cebFeatureFrp;
}));
