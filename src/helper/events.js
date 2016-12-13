import {assign} from './objects';
import {isFunction} from './types';

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
    which: 0
};

const KEYBOARD_EVENT_ARG_NAMES = [
    'bubbles',
    'cancelable',
    'view',
    'char',
    'key',
    'location',
    'modifiersList',
    'repeat'
];

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
    } else {
        event = document.createEvent('KeyboardEvent');
        event.initKeyboardEvent.apply(event, [eventType].concat(KEYBOARD_EVENT_ARG_NAMES.map(name => args[name])));
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
