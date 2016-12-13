/*jshint -W030 */
import {dispatchCustomEvent, dispatchMouseEvent} from '../src/ceb.js';

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

    context('when a MouseEvent is created and dispatched', () => {
        beforeEach((done) => {
            wrapper.addEventListener('click', listener);
            wrapper.addEventListener('click', () => done());
            dispatchMouseEvent(button, 'click');
        });
        it('should be listenable', () => {
            expect(listener).has.been.called;
        });
    });

});
