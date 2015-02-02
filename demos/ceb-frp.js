/*globals ceb:false, cebFeatureFrp:false, cebFeatureTemplate:false*/
var onChangeObserver = cebFeatureFrp.disposable(function(el) {
    return window.Rx.DOM.fromEvent(el, 'change').map(function(evt) {
        return evt.target.value;
    }).distinctUntilChanged();
}).handlers(function(el, observer) {
    observer.subscribe(function(value) {
        console.log('on change', value);
    });
});

ceb().name('ceb-ui-input').feature(cebFeatureFrp, {
    disposables: [onChangeObserver]
}).feature(cebFeatureTemplate, {
    template: '<input type="text">'
}).properties({
    value: {
        attribute: true,
        delegate: {
            target: 'input',
            property: 'value'
        },
        observable: true
    }
}).register();
