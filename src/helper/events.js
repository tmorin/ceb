import {assign} from './objects.js';
import {isFunction} from './types.js';

const CUSTOM_EVENT_ARG_NAMES = [
    'bubbles',
    'cancelable',
    'detail'
];

const DEFAULT_CUSTOM_EVENT_OPTIONS = {
    bubbles: true,
    cancelable: true,
    detail: null
};

function createCustomEvent(eventType, options) {
    let event, args = assign({}, DEFAULT_CUSTOM_EVENT_OPTIONS, options);
    if (typeof CustomEvent === 'function') {
        event = new CustomEvent(eventType, args);
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent.apply(event, [eventType].concat(CUSTOM_EVENT_ARG_NAMES.map(name => args[name])));
    }
    return event;
}

/**
 * Create and dispatch a custom event.
 * @param {!HTMLElement} el the element where the event will be dispatched
 * @param {!string} eventType the event type
 * @param {Object} [options] the options
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchCustomEvent(el, eventType, options) {
    return el.dispatchEvent(createCustomEvent(eventType, options));
}

/**
 * Create and dispatch an event based on another one.
 * The properties of the base event not found into the new one will be copied.
 * @param el the element where the new event will be dispatched
 * @param inEvt the base event
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchClonedEvent(el, inEvt) {
    let outEvt = createCustomEvent(inEvt.type, {
        bubbles: inEvt.bubbles,
        cancelable: inEvt.cancelable,
        view: inEvt.view,
        detail: inEvt
    });
    let keys = Object.keys(outEvt);
    Object.keys(inEvt)
        .filter(k => !isFunction(inEvt[k]))
        .filter(k => keys.indexOf(k) < 0)
        .forEach(k => outEvt[k] = inEvt[k]);
    return el.dispatchEvent(outEvt);
}
