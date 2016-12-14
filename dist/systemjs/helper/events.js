'use strict';

System.register(['./objects.js', './types.js'], function (_export, _context) {
    "use strict";

    var assign, isFunction, CUSTOM_EVENT_ARG_NAMES, DEFAULT_CUSTOM_EVENT_OPTIONS;


    function createCustomEvent(eventType, options) {
        var event = void 0,
            args = assign({}, DEFAULT_CUSTOM_EVENT_OPTIONS, options);
        if (typeof CustomEvent === 'function') {
            event = new CustomEvent(eventType, args);
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent.apply(event, [eventType].concat(CUSTOM_EVENT_ARG_NAMES.map(function (name) {
                return args[name];
            })));
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
    function dispatchCustomEvent(el, eventType, options) {
        return el.dispatchEvent(createCustomEvent(eventType, options));
    }

    /**
     * Create and dispatch an event based on another one.
     * The properties of the base event not found into the new one will be copied.
     * @param el the element where the new event will be dispatched
     * @param inEvt the base event
     * @returns {boolean} false if at least one of the event handlers which handled this event called Event.preventDefault(). Otherwise it returns true.
     */

    _export('dispatchCustomEvent', dispatchCustomEvent);

    function dispatchClonedEvent(el, inEvt) {
        var outEvt = createCustomEvent(inEvt.type, {
            bubbles: inEvt.bubbles,
            cancelable: inEvt.cancelable,
            view: inEvt.view,
            detail: inEvt
        });
        var keys = Object.keys(outEvt);
        Object.keys(inEvt).filter(function (k) {
            return !isFunction(inEvt[k]);
        }).filter(function (k) {
            return keys.indexOf(k) < 0;
        }).forEach(function (k) {
            return outEvt[k] = inEvt[k];
        });
        return el.dispatchEvent(outEvt);
    }

    _export('dispatchClonedEvent', dispatchClonedEvent);

    return {
        setters: [function (_objectsJs) {
            assign = _objectsJs.assign;
        }, function (_typesJs) {
            isFunction = _typesJs.isFunction;
        }],
        execute: function () {
            CUSTOM_EVENT_ARG_NAMES = ['bubbles', 'cancelable', 'detail'];
            DEFAULT_CUSTOM_EVENT_OPTIONS = {
                bubbles: true,
                cancelable: true,
                detail: null
            };
        }
    };
});