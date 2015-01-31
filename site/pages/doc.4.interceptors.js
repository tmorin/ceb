// # Interceptors

// Get a builder.
var builder = ceb().name('properties-intercepted-tag');

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
//
// > @param next (function) will call the next stacked callback
// > @param el (HTMLElement) the current element
// > @param value (*) the value of the previous stacked callback
function interceptWrite(next, el, value) {

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
//
// > @param next (function) will call the next stacked callback
// > @param el (HTMLElement) the current element
// > @param value (*) the value of the previous stacked callback
function interceptRead(next, el, value) {
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
// > @param name (string) the name of the property to intercept
// > @param interceptWrite (function) the callback for write accesses
// > @param interceptRead (function) the callback for read accesses

builder.intercept('propIntercepted', interceptWrite, interceptRead);

// The first argument of the method *intercept* is the property name.
// The second argument is the callback dedicated to the write access, it's optional.
// The third argument is the callback dedicated to the read access, it's optional.

// The write accesses of the property *propIntercepted* will be intercepted by the callback *interceptWrite*.
// The read accesses of the property *propIntercepted* will be intercepted by the callback *interceptRead*.
