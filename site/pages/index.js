// # Custom Element Builder

// **ceb** is a builder to help the development of Custom Elements.
//
// - The project is hosted on [Github](https://github.com/tmorin/custom-element-builder)
// - Read the [documentation](doc.1.usage.html) for more details
// - Or the [commented source code](ceb.html)
// - Every use cases are tested and validated from this [test suite](./testsuite)
// - The source code is continuously built on [Travis](https://travis-ci.org/tmorin/custom-element-builder)
// - The test suite is automatically executed using [Sauce Labs](https://saucelabs.com/u/customelementbuilder)
// - The code coverage report is pushed to [coveralls](https://coveralls.io/r/tmorin/custom-element-builder)
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
// ## Downloads
// Distributed files can be found [there](https://github.com/tmorin/custom-element-builder/tree/master/dist)
// - [ceb.min.js](https://raw.githubusercontent.com/tmorin/custom-element-builder/master/dist/ceb.min.js) *minified*
// - [ceb.legacy.min.js](https://raw.githubusercontent.com/tmorin/custom-element-builder/master/dist/ceb.legacy.min.js) *shims, minified*
// ***
// ## Installation
// **ceb** is not yet released!
// - npm: <code>npm install ceb --save</code>
// - bower: <code>npm bower ceb --save</code>
// - component <code>component install tmorin/custom-element-builder</code>
// - amd <code>require(['ceb', ...</code>
'use strict';

var builder = ceb().name('a-custom-element');

builder.properties({
    name: {
        attribute: true
    }
}).methods({
    sayHelloTo: function (el, n) {
        return el.name + ' say hello to ' + n + '!';
    }
});

builder.intercept('name', function (next, el, value) {
    next(value.toUpperCase());
}).wrap('sayHelloTo', function (next, el, n) {
    return next(n.toUpperCase());
});

builder.register();

var element = document.createElement('a-custom-element');
element.setAttribute('name', 'I');
element.sayHelloTo('you');

element.name = 'Again, I';
element.sayHelloTo('you');
