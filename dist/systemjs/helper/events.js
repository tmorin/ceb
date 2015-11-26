'use strict';

System.register(['./objects.js'], function (_export) {
    var assign, CUSTOM_EVENT_ARG_NAMES, MOUSE_EVENT_ARG_NAMES, DEFAULT_CUSTOM_EVENT_OPTIONS, DEFAULT_MOUSE_EVENT_OPTIONS;
    return {
        setters: [function (_objectsJs) {
            assign = _objectsJs.assign;
        }],
        execute: function () {
            CUSTOM_EVENT_ARG_NAMES = ['bubbles', 'cancelable', 'detail'];
            MOUSE_EVENT_ARG_NAMES = ['bubbles', 'cancelable', 'view', 'detail', 'screenX', 'screenY', 'clientX', 'clientY', 'ctrlKey', 'altKey', 'shiftKey', 'metaKey', 'button', 'relatedTarget'];
            DEFAULT_CUSTOM_EVENT_OPTIONS = {
                bubbles: true,
                cancelable: true,
                detail: null
            };
            DEFAULT_MOUSE_EVENT_OPTIONS = {
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
                    args = assign({}, DEFAULT_CUSTOM_EVENT_OPTIONS, options);

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

            _export('dispatchCustomEvent', dispatchCustomEvent);

            function dispatchMouseEvent(el, eventType, options) {
                var event = undefined,
                    args = assign({}, DEFAULT_MOUSE_EVENT_OPTIONS, options);

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

            _export('dispatchMouseEvent', dispatchMouseEvent);
        }
    };
});