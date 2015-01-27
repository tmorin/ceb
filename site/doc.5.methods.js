// Get a builder.
'use strict';
var builder = ceb().name('methods-tag');

// ## Methods

// The builder's method **methods** adds the given hash of methods to the structure.
builder.methods({
    sayHelloTo: function (el, name) {
        // The first argument of a method is the element instance.
        // The following arguments are the invoked arguments.
        return 'Hello ' + name + '! I am ' + el.tagName;
    }
});
