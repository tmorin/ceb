// Get a builder.
var builder = ceb().name('listening-tag');

// ## Listeners

// The builder's method **listen** will add DOM event listeners to the structure.
//
// > @param queries (string) a list of the tuple [event, selector].
// > Where the event is the name of the event and the selector a valid CSS selector.
//
// > @param listener (function) the callback which will be called when the events occurred.
// > Where the callback has two arguments, the current element and the event instance.
builder.listen('click, click button, submit form', function (el, evt) {
    evt.preventDefault();
    evt.stopPropagation();
});

// The event are added when the element is **attached** into the DOM and removed when it's **detached**.

// `click, click button, submit form` contains three clauses:
// - the first will add a listener listening the click event on the element instance
// - the second will add a listener listening the click event on the child matching button
// - the third will add a listener listening the submit event on the child matching form
