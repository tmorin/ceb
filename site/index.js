// ceb is a builder to help the development of Custom Elements.
//
// The project is hosted on [Github](https://github.com/tmorin/custom-element-builder).
// Every use cases implemented are tested and validated from theses [specs](./specs)
//
// ceb is continuously tested on [Travis](https://travis-ci.org/tmorin/custom-element-builder).
// The test suite is automatically executed on several devices using [Sauce Labs](https://saucelabs.com/u/customelementbuilder).
// The code coverage can be found on [coveralls](https://coveralls.io/r/tmorin/custom-element-builder).
//
// Documentation can be found [there](doc.html).
//
// To execute ceb into none evergreen browsers, you should need of:
// - Obviously [Custom Elements](http://www.w3.org/TR/custom-elements/)
//  - webcomponents-lite.js from [webcomponents.org](http://webcomponents.org/polyfills/)
//  - or [document-register-element](https://github.com/WebReflection/document-register-element)
// - ES5 and some features from ES6 [es6-shim](https://github.com/paulmillr/es6-shim)
//
// Distributed files can be found [there](https://github.com/tmorin/custom-element-builder/tree/master/dist)
// - [ceb.min.js](https://raw.githubusercontent.com/tmorin/custom-element-builder/master/dist/ceb.min.js)
//  - minificated source code
// - [ceb.shims.min.js](https://raw.githubusercontent.com/tmorin/custom-element-builder/master/dist/ceb.shims.min.js)
//  - required Custom Elements polyfill and ES6 shims
//  - minificated source code
'use strict';

var builder = ceb().name('a-custom-element');

builder.properties({
    name: {
        attribute: true
    }
}).methods({
    sayHelloTo: function (el, n) {
        return el.name + ' say hello to '+ n + '!';
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
