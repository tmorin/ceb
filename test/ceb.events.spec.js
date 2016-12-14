/*jshint -W030 */
import {dispatchCustomEvent, dispatchClonedEvent, assign, isFunction} from '../src/ceb.js';

describe('ceb.events', () => {
    let sandbox, wrapper, button, listener;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        sandbox.innerHTML = `
            <div id="wrapper">
                <button id="button"></button>
            </div>
        `;
        wrapper = sandbox.querySelector('#wrapper');
        button = sandbox.querySelector('#button');
        listener = sinon.spy();
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    context('when a CustomEvent is created and dispatched', () => {
        beforeEach((done) => {
            wrapper.addEventListener('custom', listener);
            wrapper.addEventListener('custom', () => done());
            dispatchCustomEvent(button, 'custom', {
                detail: 'dispatched'
            });
        });
        it('should be listenable', () => {
            expect(listener).has.been.called;
        });
    });

    context('hide native event', () => {
        it('should be stopped but not prevented', done => {
            sandbox.innerHTML = `<div><input/></div>`;
            let sandboxListener = evt => {
                sandbox.removeEventListener('click', sandboxListener);
                expect(evt.detail.target).to.eq(sandbox.querySelector('input'));
                expect(evt.target).to.eq(sandbox.querySelector('div'));
                done();
            };
            sandbox.addEventListener('click', sandboxListener);

            let div = sandbox.querySelector('div');
            let divListener = evt => {
                div.removeEventListener('click', divListener);
                dispatchClonedEvent(div, evt);
                div.addEventListener('click', divListener);
            };
            div.addEventListener('click', divListener);

            dispatchMouseEvent(sandbox.querySelector('input'), 'click');
        });
    });

})
;

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

function dispatchMouseEvent(el, eventType, options) {
    let event, args = assign({}, DEFAULT_MOUSE_EVENT_OPTIONS, options);
    if (isFunction(MouseEvent)) {
        event = new MouseEvent(eventType, args);
    } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent.apply(event, [eventType].concat(MOUSE_EVENT_ARG_NAMES.map(name => args[name])));
    }
    return el.dispatchEvent(event);
}
