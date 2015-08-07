import Rx from 'rx';
import cebFeatureFrp from './ceb-feature-frp';

cebFeatureFrp.libraries.Rx = {};

cebFeatureFrp.libraries.Rx.propertyObserverFactory = function () {
    return new Rx.Subject();
};

cebFeatureFrp.libraries.Rx.propertyObservableInterceptor = function (next, el, propName, value) {
    next(value);
    el[propName + 'Observer'].onNext(value);
};

cebFeatureFrp.libraries.Rx.disposeDisposable = function (observer) {
    if(observer.dispose) {
        observer.dispose();
    }
};

export default cebFeatureFrp;