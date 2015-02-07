// # Custom Elements Builder
// **ceb** is a scalable builder to help the development of Custom Elements.
// - The project is hosted on [Github](https://github.com/tmorin/custom-elements-builder)
// - Every use cases are tested and validated from this [test suite](./testsuite)
// - [Change logs](changelogs.html) [coveralls](https://coveralls.io/r/tmorin/custom-elements-builder) [Travis](https://travis-ci.org/tmorin/custom-elements-builder) [Sauce Labs](https://saucelabs.com/u/customelementbuilder)
// ***
// ## Guides
// - [0.2.x](0.2.x/doc.1.usage.html)
// - [0.1.x](0.1.x/doc.1.usage.html)
// - [ceb and requirejs integration](https://github.com/tmorin/ceb-example-requirejs)
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
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb.min.js"></script>
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb-feature-template.min.js"></script>
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb-feature-frp.min.js"></script>
//
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.2/ceb-feature-frp-rx.min.js"></script>
//
// ***
// ## Installation
// - npm: `npm install ceb --save`
// - bower: `npm bower ceb --save`
// - amd: `require(['ceb', ...`
// - amd: `require(['ceb-feature-template', ...`
// - amd: `require(['ceb-feature-frp', ...`
// - amd: `require(['ceb-feature-frp-rx', ...`

/* get a builder from a name */
var builder = ceb().name('super-button');

/* super-button is an extention of the HTML button element */
builder.extends('button').proptotype(Object.create(HTMLButtonElement.prototype));

/* define properties linked or not to attributes */
builder.properties({
    label: {
        attribute: {
            boolean: true
        },
        /*
            when the label property is updated,
            its value is push to the delegated target
        */
        delegate: {
            target: 'span.label',
            property: 'textContent'
        },
        setter: function (el, propName, value) {
            /*
                I am bound to an attribute,
                so, the given value will come from the set instruction
                and the returned value will be the attribute's value
            */
            return value.toLowerCase();
        },
        getter: function (el, propName, value) {
            /*
                I am still bound to an attribute,
                so, the given value will be the attribute value
                and the returned value will be the value of the get instruction
            */
            return value;
        }
    }
});

/* define methods */
builder.methods({
    createdCallback: function (el) {
        /*
            yes, I am like another method
            and yes, I will always have the element instance as first argument
        */
    }
});

/* listen events */
builder.listen('click', function (el, evt){
    /* again, I've got the element instance as first argument */
});

/* the scalable part of ceb */
builder.feature(cebTemplateFeature, {
    template: '<span class="label"></span><span ce-content></span>'
});

/* register the super-button */
var SuperButton = builder.register();
