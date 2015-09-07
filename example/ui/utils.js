export function trigger(el, name, detail) {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, true, true, detail);
    return el.dispatchEvent(evt);
}
