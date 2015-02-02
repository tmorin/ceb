ceb()
    .name('hello-world1')
    .methods({
        createdCallback: function (el) {
            el.textContent = 'Hello world!';
        }
    })
    .register();
document.body.appendChild(document.createElement('hello-world1'));
document.body.appendChild(document.createElement('hr'));

ceb()
    .name('hello-world2')
    .feature(cebFeatureTemplate, {
        template: '<strong>Hello world!</strong>'
    })
    .register();
document.body.appendChild(document.createElement('hello-world2'));
document.body.appendChild(document.createElement('hr'));

ceb()
    .name('hello-world3')
    .properties({
        to: {
            value: 'world',
            set: function (el, propName, value) {
                el.querySelector('span').textContent = value;
            }
        }
    })
    .feature(cebFeatureTemplate, {
        template: '<strong>Hello <span></span>!</strong>'
    })
    .register();
document.body.appendChild(document.createElement('hello-world3'));
document.body.appendChild(document.createElement('hr'));

ceb()
    .name('hello-world4')
    .properties({
        to: {
            value: 'world',
            delegate: {
                target: 'span',
                property: 'textContent'
            }
        }
    })
    .feature(cebFeatureTemplate, {
        template: '<strong>Hello <span></span>!</strong>'
    })
    .register();
document.body.appendChild(document.createElement('hello-world4'));
document.body.appendChild(document.createElement('hr'));

ceb()
    .name('hello-world5')
    .feature(cebFeatureTemplate, {
        template: '<strong>Hello <span ceb-content></span>!</strong>'
    })
    .register();
document.body.appendChild((function () {
    var helloWorld5 = document.createElement('hello-world5');
    helloWorld5.contentNode.appendChild(document.createTextNode('world'));
    return helloWorld5;
}()));
document.body.appendChild(document.createElement('hr'));

ceb()
    .name('hello-world6')
    .feature(cebFeatureTemplate, {
        template: '<button ceb-ref="btn">Click me!</button>' +
            '<strong ceb-ref="strg" hidden>Hello <span ceb-ref="to"></span>!</strong>'
    })
    .feature(cebFeatureFrp, {
        disposables: [
            cebFeatureFrp.disposable(function (el) {
                return window.Rx.Observable
                    .fromEvent(cebFeatureTemplate(el).btn, 'click')
                    .throttle(500);
            }).handlers(function (el, observer) {
                observer.subscribe(function () {
                    cebFeatureTemplate(el).to.textContent = 'world';
                    cebFeatureTemplate(el).strg.hidden = false;
                    cebFeatureTemplate(el).btn.disabled = true;
                });
            })
        ]
    })
    .register();
document.body.appendChild(document.createElement('hello-world6'));
