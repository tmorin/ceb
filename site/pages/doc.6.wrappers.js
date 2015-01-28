// # Wrappers

// Get a builder.
'use strict';
var builder = ceb().name('methods-wrapped-tag');

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

//### Wrap

//The builder’s method **wrap** adds to the structure the given wrapper according to the wrapper method.
//
//The first argument of the method *wrap* is the method name.
//The second argument is the callback.

//The execution of *methodWrapped* will be wrapped with the callback *wrapper*.
builder.wrap('methodWrapped', wrapper);
