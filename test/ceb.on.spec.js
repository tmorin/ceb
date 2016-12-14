/*jshint -W030 */
import {element, template, on, dispatchCustomEvent, dispatchClonedMouseEvent} from '../src/ceb.js';

function listen(el, type, limit, done) {
    let counter = 0;
    let listener = () => {
        counter++;
        if (counter === limit) {
            done();
            el.removeEventListener(type, listener);
        }
    };
    el.addEventListener(type, listener);
}

describe('ceb.on()', function () {
    let sandbox, builder;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = element();
    });
    afterEach(() => {
        sandbox.innerHTML = '';
    });

    context('listen custom events', () => {
        let bubblingListener, captureListener, el;
        beforeEach(done => {
            bubblingListener = sinon.spy();
            captureListener = sinon.spy();

            builder.builders(
                on('custom-event').invoke(bubblingListener),
                on('custom-event').invoke(captureListener).capture(),
                template('<input/>')
            ).register('test-on-custom-event');

            sandbox.appendChild((el = document.createElement('test-on-custom-event')));

            listen(sandbox, 'custom-event', 1, done);

            setTimeout(() => {
                dispatchCustomEvent(el.querySelector('input'), 'custom-event');
            }, 10);
        });
        it('should invoke the bubbling and capture listeners', () => {
            expect(bubblingListener).to.have.been.calledOnce;
            expect(bubblingListener).to.be.calledWith(el, sinon.match(Object));

            expect(captureListener).to.have.been.calledOnce;
            expect(captureListener).to.be.calledWith(el, sinon.match(Object));
        });
    });

    context('listen custom events on target', () => {
        let bubblingListener, captureListener, el;
        beforeEach(done => {
            bubblingListener = sinon.spy();
            captureListener = sinon.spy();

            builder.builders(
                on('custom-event input').invoke(bubblingListener),
                on('custom-event input').invoke(captureListener).capture(),
                template('<input/>')
            ).register('test-on-custom-event-target');

            sandbox.appendChild((el = document.createElement('test-on-custom-event-target')));

            listen(sandbox, 'custom-event', 1, done);

            setTimeout(() => {
                dispatchCustomEvent(el.querySelector('input'), 'custom-event');
            }, 10);
        });
        it('should invoke the bubbling and capture listeners', () => {
            expect(bubblingListener).to.have.been.calledOnce;
            expect(bubblingListener).to.be.calledWith(el, sinon.match(Object));

            expect(captureListener).to.have.been.calledOnce;
            expect(captureListener).to.be.calledWith(el, sinon.match(Object));
        });
    });

    context('listen events with delegated elements', () => {
        let fn, fnI1, fnI, el;
        beforeEach(done => {
            fn = sinon.spy();
            fnI1 = sinon.spy();
            fnI = sinon.spy();

            builder.builders(
                on('custom-event').invoke(fn),
                on('custom-event').delegate('.i1').invoke(fnI1),
                on('custom-event').delegate('i').invoke(fnI),
                template(`<i class="i1"><b>i1</b></i><i class="i2"><b>i2</b></i>`)
            ).register('test-on-delegate');

            sandbox.appendChild((el = document.createElement('test-on-delegate')));

            listen(sandbox, 'custom-event', 3, done);

            setTimeout(() => {
                dispatchCustomEvent(el.querySelector('.i1'), 'custom-event');
                dispatchCustomEvent(el.querySelector('.i2'), 'custom-event');
                dispatchCustomEvent(el.querySelector('.i1 b'), 'custom-event');
            }, 10);
        });
        it('should invoke listeners', () => {
            expect(fn).to.have.been.calledThrice;
            expect(fnI).to.have.been.calledThrice;
            expect(fnI1).to.have.been.calledTwice;
            expect(fnI1).to.be.calledWith(el, sinon.match(Object), el.querySelector('.i1'));
            expect(fnI1).to.be.calledWith(el, sinon.match(Object), el.querySelector('.i1'));
            expect(fnI1.getCall(0).args[1].target).to.eq(el.querySelector('.i1'));
            expect(fnI.getCall(1).args[1].target).to.eq(el.querySelector('.i2'));
        });
    });

    context('skip propagation and default behavior', () => {
        let wrapperListener, elListener, wrapper, el;
        beforeEach(done => {
            wrapperListener = sinon.spy();
            elListener = sinon.spy();

            builder.builders(
                on('custom-event').skip().invoke(elListener),
                template('<button>button</button>')
            ).register('test-on-skip');

            wrapper = document.createElement('div');
            wrapper.appendChild((el = document.createElement('test-on-skip')));
            sandbox.appendChild(wrapper);

            wrapper.addEventListener('custom-event', wrapperListener);

            setTimeout(() => {
                listen(el, 'custom-event', 1, done);
                dispatchCustomEvent(el.querySelector('button'), 'custom-event');
            }, 10);
        });
        it('should invoke listeners', () => {
            expect(elListener).to.have.been.calledOnce;
            expect(wrapperListener).to.have.not.been.called;
        });
    });

});
