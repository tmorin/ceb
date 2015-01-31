// # Custom Elements Builder

// **ceb** is a builder to help the development of Custom Elements.
//
// - The project is hosted on [Github](https://github.com/tmorin/custom-elements-builder)
// - Read the [documentation](doc.1.usage.html) for more details
// - Or the [commented source code](ceb.html)
// - Every use cases are tested and validated from this [test suite](./testsuite)
// - The source code is continuously built on [Travis](https://travis-ci.org/tmorin/custom-elements-builder)
// - The test suite is automatically executed using [Sauce Labs](https://saucelabs.com/u/customelementbuilder)
// - The code coverage report is pushed to [coveralls](https://coveralls.io/r/tmorin/custom-elements-builder)
// ***
// ## Compatibilities
// [![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)
//
// **ceb** should and will work without dependencies on evergreen browsers.
// To execute it with none evergreen browsers, you should need of:
// - Obviously [Custom Elements](http://www.w3.org/TR/custom-elements/) polyfill
//  - webcomponents-lite.js from [webcomponents.org](http://webcomponents.org/polyfills/)
//  - or [document-register-element](https://github.com/WebReflection/document-register-element)
// - ES5 and some features from ES6 [es6-shim](https://github.com/paulmillr/es6-shim)
// ***
// ## CDN
// CDN files can be found on [cdnjs](https://cdnjs.com/libraries/custom-elements-builder)
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.1.0/ceb.min.js"></script>
//
// ***
// ## Installation
// - npm: `npm install ceb --save`
// - bower: `npm bower ceb --save`
// - component `component install tmorin/custom-elements-builder`
// - amd: `require(['ceb', ...`

/* http://jsfiddle.net/tmorin/xce2e756/ */

var template = '';
template += '<em ceb-ref="fromNode" class="from"></em> say hello <em class="to"></em>!';
template += '<br>';
template += '<button>or to the world</button>';

ceb()
    .name('saying-hello')
    .feature(cebFeatureTemplate, {
        template: template
    })
    .properties({
        from: {
            attribute: true,
            setter: function (el, value) {
                console.log(el);
                cebFeatureTemplate(el).fromNode.textContent = value;
                return value;
            }
        },
        to: {
            attribute: true,
            delegate: {
                target: 'em.to',
                property: 'textContent'
            }
        }
    })
    .intercept('from', function (next, el, value) {
        return next(value.toUpperCase());
    })
    .intercept('to', function (next, el, value) {
        return next(value.toUpperCase());
    })
    .methods({
        sayHello: function (el, to) {
            return el.from + ' say hello ' + (to || el.to) + '!';
        }
    })
    .wrap('sayHello', function (next, el, to) {
        var newArguments = [next, el, (to || '').toUpperCase()];
        var result = next(newArguments);
        alert(result);
        return result;
    })
    .listen('click button', function (el) {
        el.sayHello('world');
    })
    .register();

var sayingHello = document.createElement('saying-hello');
sayingHello.setAttribute('from', 'I');
sayingHello.to = 'you';

document.body.appendChild(sayingHello);
