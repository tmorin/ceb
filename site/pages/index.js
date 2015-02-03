// # Custom Elements Builder
//
// **ceb** is a builder to help the development of Custom Elements.
//
// - The project is hosted on [Github](https://github.com/tmorin/custom-elements-builder)
// - Every use cases are tested and validated from this [test suite](./testsuite)
// - The source code is continuously built on [Travis](https://travis-ci.org/tmorin/custom-elements-builder)
// - The test suite is automatically executed using [Sauce Labs](https://saucelabs.com/u/customelementbuilder)
// - The code coverage report is pushed to [coveralls](https://coveralls.io/r/tmorin/custom-elements-builder)
// - [Change logs](changelogs.html)
// ***
// ## Documentation
// - [0.2.x](0.2.x/doc.1.usage.html)
// - [0.1.x](0.1.x/doc.1.usage.html)
//
// - [ceb.js](ceb.html)
// - [ceb-feature-template.js](ceb-feature-template.html)
// - [ceb-feature-frp.js](ceb-feature-frp.html)
// ***
// ## Compatibilities
// [![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)
//
// **ceb** should and will work without dependencies on evergreen browsers.
// However for the others like IE9/IE10 you have to use a [Custom Elements](http://www.w3.org/TR/custom-elements/) polyfill like:
// - webcomponents-lite.js from [webcomponents.org](http://webcomponents.org/polyfills/)
// - or [document-register-element](https://github.com/WebReflection/document-register-element)
// ***
// ## CDN
// CDN files can be found on [cdnjs](https://cdnjs.com/libraries/custom-elements-builder)
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.0/ceb.min.js"></script>
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.0/ceb-feature-template.min.js"></script>
//
// ***
// ## Installation
// - npm: `npm install ceb --save`
// - bower: `npm bower ceb --save`
// - amd: `require(['ceb', ...`
// - amd: `require(['ceb-feature-template', ...`
// - amd: `require(['ceb-feature-frp', ...`

/* http://jsfiddle.net/tmorin/xce2e756 */

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
                return window.Rx.DOM.click(cebFeatureTemplate(el).btn).throttle(200);
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