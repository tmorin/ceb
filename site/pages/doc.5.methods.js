// # Methods

// Get a builder.
var builder = ceb().name('methods-tag');

// ## Methods

// The builder's method **methods** adds the given hash of methods to the structure.
//
// > @param methods (object) a map of methods
builder.methods({
    sayHelloTo: function (el, name) {
        // The first argument of a method is the element instance.
        // The following arguments are the invoked arguments.
        return 'Hello ' + name + '! I am ' + el.tagName;
    }
});
