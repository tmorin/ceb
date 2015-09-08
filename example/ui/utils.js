export function trigger(el, options, detail) {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(options.name, options.bubbles, options.cancellable, detail);
    return el.dispatchEvent(evt);
}
