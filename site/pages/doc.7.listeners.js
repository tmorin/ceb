// # Listeners

// Get a builder.
var builder = ceb().name('listening-tag');

// ## Listeners

// The builder's method **listen** detect from tis given arguments event listeners.
// <code>click, click button, submit form</code> contains three clauses:
// - the first will add a listener listening the click event on the element instance
// - the second will add a listener listening the click event on the child matching button
// - the third will add a listener listening the submit event on the child matching form
builder.listen('click, click button, submit form', function (el, evt) {
    evt.preventDefault();
    evt.stopPropagation();
});

// The event are added when the element is inserted into the DOM and removed when it's removed.
