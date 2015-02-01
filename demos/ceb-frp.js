ceb()
    .name('ceb-ui-input')
    .feature(window.cebFeatureFrp, {
        observers: [
        function (el) {
             var source = window.Rx.DOM.fromEvent(el, 'change').map(function(evt) {
                 return evt.target.value;
             }).distinctUntilChanged();
             source.subscribe(function (value) {
                 console.log('on change', value);
            });
            return source;
        }
        ]
    })
    .feature(cebFeatureTemplate, {
        template: '<input type="text">'
    })
    .properties({
        value: {
            attribute: true,
            delegate: {
                target: 'input',
                property: 'value'
            },
            observable: true
        }
    })
    .register();
