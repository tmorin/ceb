// ## Get a builder
'use strict';

// A builder is created from a tag name.
var builder = ceb().name('demo-custom-element');

// It provides several methods helping to defined the structure of a custom element.
// A structure is composed of the following elements:
// - extends and prototype values
// - properties
// - methods
// - interceptors catching the set and get of properties
// - wrapper wrapping the call of methods

// ## Extends and prototype

// By default the structure doesn't set an extends value.
// However, the prototype value is by default *Object.create(HTMLElement.prototype)*

// The builder's method **extends** adds the given extends value to the structure.
builder.extends('button');

// The builder's method **prototype** adds the given prototype value to the structure.
builder.prototype(Object.create(HTMLButtonElement.prototype));

// ## Properties

// The builder's method **properties** adds the given hash of properties to the structure.
builder.properties({
    // **Writable value**

    // The property *propWritable* will be initialized with the value *initial value*.
    // It can be updated on runtime.
    propWritable: {
        value: 'initial value',
        writable: true
    },

    // **Read only value**
    //
    // The property *propReadonly* will be initialized with the value *initial value*.
    // It can't be updated on runtime.
    propReadonly: {
        value: 'initial value',
        writable: false
    },

    // **Accessors**

    // The property *propAccessors* will be initialized given the value *initial value* to the setter.
    //
    // When *propAccessors* will be set (*obj.propAccessors = 'value'*), the setter will be called.
    //
    // When *propAccessors* will be get (*var value = obj.propAccessors*), the getter will be called.
    propAccessors: {
        value: 'initial value',
        // Set accessors are called with the custom element instance and the set value.
        // They should store the values somewhere in order to retrieve them for the getters.
        set: function (el, value) {
            el._setAndGetProperty = value;
        },

        // Get accessors are called with the custom element instance.
        // They should return something.
        get: function (el) {
            return el._setAndGetProperty;
        }
    }
});

// ### Properties and attributes

// Properties can be linked to element's attributes.
// When a property is updated, the linked attribute is updated too.
// When an attribute is updated, the linked property is updated too.
//
// Properties linked to attributes have automatically built accessors.
// Properties linked to attributes can only handle string and boolean values.
builder.properties({
    // **Default behavior**

    // The property *propAtt* is linked to the attribute *prop-att*.
    // *propAtt* and its attribute is initialized with the value *initial value*.
    propAtt: {
        value: 'initial value',
        attribute: true
    },

    // **Boolean value**

    // The property *propAttBool* is linked to the attribute *prop-att-bool*.
    // *propAttBool* and its attribute is initialized with the value *initial value*.
    //
    // When *propAttBool* is true, attribute is present into the DOM and have the value *""*.
    // When *propAttBool* is false, attribute is not present into the DOM.
    propAttBool: {
        value: true,
        attribute: {
            boolean: true
        }
    },

    // **Linked to another attribute name**

    // The property *propAttBis* is linked to the attribute having the name *another-attribute-name*.
    propAttBis: {
        attribute: {
            name: 'another-attribute-name'
        }
    },

    // **Setter and getter**

    // Properties linked to attributes can have setters and getters too.
    // However, their accessors are already defined by *ceb* to deal with the linked attributes.
    // Their API are closed, but fundamentally different.
    //
    // Attribute's setter and getter act as interceptors.
    // They give a way to change the future attribute value or to change the read attribute value.
    propAttAccessors: {
        value: 'initial value',
        attribute: true,
        // Attributes' setter are called with the element instance and the set value.
        // The returned value will be the attribute's value.
        setter: function (el, value) {
            return value;
        },
        // Attributes' getter are called with the element instance and the attribute's value.
        // The returned value will be the get value.
        getter: function (el, value) {
            return value;
        }
    }
});

// ## Methods

// The builder's method **methods** adds the given hash of methods to the structure.
builder.methods({
    sayHelloTo: function (el, name) {
        // The first argument of a method is the element instance.
        // The following arguments are the invoked arguments.
        return 'Hello ' + name + '! I am ' + el.tagName;
    }
});

// ## Interceptors

// Properties having accessors or properties linked to attributes can have interceptors.
// Interceptors can intercept write and read accesses of properties.
// They wrap the accessors, by this way they can process logic around the effective access.

// Interceptors work only against structure's properties.
//
// The property *propIntercepted* has accesors, so accesses can be intercetped.
builder.properties({
    propIntercepted: {
        set: function (el, value) {
            el._propIntercepted = value;
        },
        get: function (el) {
            return el._propIntercepted;
        }
    }
});

// ### Write callback

// The function *interceptWrite* is a write access callback.
function interceptWrite(next, el, value) {
    // The argument *value* is the value of the previous stacked callback.

    // There, logic can be done with the element instance and the given value.
    var processedValue = (value || '').toUpperCase();

    // The function *next* will call the next stacked callback.
    // Its argument will be the *value* of the next stacked callback.
    var result = next(processedValue);

    // There, logic can be done with the element instance and the returned value.
    // Usually accessors set and so interceptors dedicated for writing don't return values.
    console.log(el.tagName, 'a property has been written');

    // *result* will be the returned value of the function *next* into the previous stacked callback.
    return result;
}

// ### Read callback

// The function *interceptRead* is a read access callback.
function interceptRead(next, el, value) {
    // The argument *value* is the value of the previous stacked callback.
    // Usually accessors get and so interceptors dedicated for reading don't have given value.

    // There, logic can be done with the element instance and the given value.
    console.log(el.tagName, 'a property is going to be read');

    // The function *next* will call the next stacked callback.
    // Its argument will be the value of the next stacked callback.
    var result = next(value);

    // There, logic can be done with the element instance and the returned value.
    var processedResult = (result || '').toLowerCase();

    // *processedResult* will be the returned value of the function *next* into the previous stacked callback.
    return processedResult;
}

// ### Intercept

// The builder’s method **intercept** adds to the structure the given interceptors according to the intercepted property.
//
// The first argument of the method *intercept* is the property name.
// The second argument is the callback dedicated to the write access, it's optional.
// The third argument is the callback dedicated to the read access, it's optional.

// The write accesses of the property *propIntercepted* will be intercepted by the callback *interceptWrite*.
// The read accesses of the property *propIntercepted* will be intercepted by the callback *interceptRead*.
builder.intercept('propIntercepted', interceptWrite, interceptRead);

// ## Wrappers

// Methods can have wrappers.
// Wrappers will wrap the method execution, by this way they can process logic around the effective execution.


// Interceptors work only against structure’s methods.
builder.methods({
    methodWrapped: function (el, firsname, lastname) {
        return 'Hello ' + firsname + ' ' + lastname + '!';
    }
});

// ### Callback

// The function *wrapper* is the wrapper callback.
function wrapper(next, el, firsname, lastname) {
    // The first two arguments are always valuated, however the following are given according tothe method execution.

    // There, logic can be done with the element instance and the given arguments.
    var f = firsname || 'anonymous';
    var l = lastname || '';

    // The function *next* will call the next stacked callback.
    //
    // When input arguments are not changed *next(arguments)* works well.
    // Because arguments are changed, the arguments' array have to created manually.
    var result = next(Array.prototype.slice.call(arguments).slice(0, 2).concat([f, l]));

    // There, logic can be done with the element instance and the returned value.
    var processedResult = '<blink>' + result + '</blink>';

    // *processedResult* will be the returned value of the function *next* into the previous stacked callback.
    return processedResult;
}

// ### Wrap

// The builder’s method **wrap** adds to the structure the given wrapper according to the wrapper method.
//
// The first argument of the method *wrap* is the method name.
// The second argument is the callback.

// The execution of *methodWrapped* will be wrapped with the callback *wrapper*.
builder.wrap('methodWrapped', wrapper);

// ## Make it works

// When the setup of the structure is done,
// the builder’s method **register** will register the corresponding custom element.
var DemoCustomElement = builder.register();

// The returned value is the JavaScript class of the registered custom element.
// It can be used as prototype of another one.
ceb().name('proto-demo-custom-element').prototype(Object.create(DemoCustomElement.prototype));

// ## Reuse a structure

// The builder's structure can be retrieved using the builder's method **get**.
var aStructure = builder.get();

// The given structure can be used as based structure of a future builder.
ceb({
    struct: aStructure
}).name('based-custom-element').register();
