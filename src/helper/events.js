import {assign} from './objects.js';
import {isFunction, isUndefined} from './types.js';

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

const DEFAULT_MOUSE_EVENT_OPTIONS = {
    bubbles: true,
    cancelable: true,
    view: window,
    detail: 0,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: null
};

const MOUSE_EVENT_ARG_NAMES = [
    'bubbles',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget'
];

const DEFAULT_KEYBOARD_EVENT_OPTIONS = {
    bubbles: true,
    cancelable: true,
    view: window,
    char: '',
    key: '',
    location: 0,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    repeat: false,
    locale: '',
    detail: 0,
    keyCode: 0,
    charCode: 0,
    which: 0,
    modifiersList: ''
};

/**
 * Create and dispatch a custom event.
 * @param {!HTMLElement} el the element where the event will be dispatched
 * @param {!string} eventType the event type
 * @param {Object} [options] the options
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchCustomEvent(el, eventType, options) {
    let event, args = assign({}, DEFAULT_CUSTOM_EVENT_OPTIONS, options);
    if (typeof CustomEvent === 'function') {
        event = new CustomEvent(eventType, args);
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent.apply(event, [eventType].concat(CUSTOM_EVENT_ARG_NAMES.map(name => args[name])));
    }
    return el.dispatchEvent(event);
}

/**
 * Create and dispatch a mouse event (click, mousedown, mouseup, mouseover, mouseout, mousemove, contextmenu, dblclick).
 * @param {!HTMLElement} el the element where the event will be dispatched
 * @param {!string} eventType the event type
 * @param {Object} [options] the options
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchMouseEvent(el, eventType, options) {
    let event, args = assign({}, DEFAULT_MOUSE_EVENT_OPTIONS, options);
    if (isFunction(MouseEvent)) {
        event = new MouseEvent(eventType, args);
    } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent.apply(event, [eventType].concat(MOUSE_EVENT_ARG_NAMES.map(name => args[name])));
    }
    return el.dispatchEvent(event);
}

/**
 * Create and dispatch a keyboard event (keydown, keypress, keyup).
 * @param {!HTMLElement} el the element where the event will be dispatched
 * @param {!string} eventType the event type
 * @param {Object} [options] the options
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchKeyboardEvent(el, eventType, options) {
    let event, args = assign({}, DEFAULT_KEYBOARD_EVENT_OPTIONS, options);
    if (isFunction(KeyboardEvent)) {
        event = new KeyboardEvent(eventType, args);
    } else if (navigator.userAgent.indexOf('Trident/') > -1) {
        event = document.createEvent('KeyboardEvent');
        // ie
        event.initKeyboardEvent(eventType, args.bubbles, args.cancelable, args.view, args.key, args.location, args.modifiersList, args.repeat, args.locale);
    } else {
        event = document.createEvent('KeyboardEvent');
        // w3c
        event.initKeyboardEvent(eventType, args.bubbles, args.cancelable, args.view, args.char, args.key, args.location, args.modifiersList, args.repeat, args.locale);
    }
    return el.dispatchEvent(event);
}

/**
 * Create and dispatch an HTML event (change, etc.).
 * @param {!HTMLElement} el the element where the event will be dispatched
 * @param {!string} eventType the event type
 * @param {Object} [options] the options
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchHtmlEvent(el, eventType, options) {
    let event, args = assign({}, DEFAULT_MOUSE_EVENT_OPTIONS, options);
    if (typeof HTMLEvents === 'function') {
        event = new Events(eventType, args);
    } else {
        event = document.createEvent('HTMLEvents');
        event.initEvent.apply(event, [eventType].concat(MOUSE_EVENT_ARG_NAMES.map(name => args[name])));
    }
    return el.dispatchEvent(event);
}

/**
 * Dispatch from the given element a clone of the given mouse event.
 * @param {!HTMLElement} el the element
 * @param {!MouseEvent} inEvt the event
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchClonedMouseEvent(el, inEvt) {
    let outEvt = isFunction(MouseEvent) ? new MouseEvent(eventType) : document.createEvent('MouseEvents');
    Object.keys(inEvt)
        .filter(k => ['target'].indexOf(k) > -1)
        .filter(k => !isFunction(inEvt[k]))
        .forEach(k => outEvt[k] = inEvt[k]);
    return el.dispatchEvent(outEvt);
}

/**
 * Dispatch from the given element a clone of the given keyboard event.
 * @param {!HTMLElement} el the element
 * @param {!KeyboardEvent} inEvt the event
 * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
 */
export function dispatchClonedKeyboardEvent(el, inEvt) {
    let outEvt = isFunction(KeyboardEvent) ? new KeyboardEvent(eventType) : document.createEvent('MouseEvents');
    Object.keys(inEvt)
        .filter(k => ['target'].indexOf(k) > -1)
        .filter(k => !isFunction(inEvt[k]))
        .forEach(k => outEvt[k] = inEvt[k]);
    return el.dispatchEvent(outEvt);
}
