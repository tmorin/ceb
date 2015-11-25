'use strict';

define(['exports', './object.js'], function (exports, _object) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.dispatchCustomEvent = dispatchCustomEvent;
    exports.dispatchMouseEvent = dispatchMouseEvent;
    var CUSTOM_EVENT_ARG_NAMES = ['bubbles', 'cancelable', 'detail'];
    var MOUSE_EVENT_ARG_NAMES = ['bubbles', 'cancelable', 'view', 'detail', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey', 'altKey', 'shiftKey', 'metaKey', 'button', 'relatedTarget'];
    var DEFAULT_CUSTOM_EVENT_OPTIONS = {
        bubbles: true,
        cancelable: true,
        detail: null
    };
    var DEFAULT_MOUSE_EVENT_OPTIONS = {
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

    function dispatchCustomEvent(el, eventType, options) {
        var event = undefined,
            args = (0, _object.assign)({}, DEFAULT_CUSTOM_EVENT_OPTIONS, options);

        if (typeof CustomEvent === 'function') {
            event = new CustomEvent(eventType, args);
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent.apply(event, [eventType].concat(CUSTOM_EVENT_ARG_NAMES.map(function (name) {
                return args[name];
            })));
        }

        return el.dispatchEvent(event);
    }

    function dispatchMouseEvent(el, eventType, options) {
        var event = undefined,
            args = (0, _object.assign)({}, DEFAULT_MOUSE_EVENT_OPTIONS, options);

        if (typeof MouseEvent === 'function') {
            event = new MouseEvent(eventType, args);
        } else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent.apply(event, [eventType].concat(MOUSE_EVENT_ARG_NAMES.map(function (name) {
                return args[name];
            })));
        }

        return el.dispatchEvent(event);
    }
});