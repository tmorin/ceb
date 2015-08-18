/*jshint -W030 */

import {ceb, template, on} from '../lib/ceb';
import {canClick, click} from './helper';

describe('ceb.on()', function () {
    var sandbox, builder;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = ceb();
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should invoke during the bubbling phase', done => {
        var fn = sinon.spy();
        builder.augment(on('click').invoke(fn), template('<button>button</button>')).register('test-on-bubbling');
        var el = document.createElement('test-on-bubbling');
        sandbox.appendChild(el);
        var evt = click(el);
        setTimeout(() => {
            if (canClick()) {
                expect(fn).to.have.been.calledOnce;
                expect(fn).to.be.calledWith(el, evt);
            }
            done();
        }, 10);
    });

    it('should invoke during the capture phase', done => {
        var fn = sinon.spy();
        builder.augment(on('click').invoke(fn).capture(), template('<button>button</button>')).register('test-on-capture');
        var el = document.createElement('test-on-capture');
        sandbox.appendChild(el);
        var evt = click(el);
        setTimeout(() => {
            if (canClick()) {
                expect(fn).to.have.been.calledOnce;
                expect(fn).to.be.calledWith(el, evt);
            }
            done();
        }, 10);
    });

    it('should invoke on delegate events', done => {
        var fn = sinon.spy();
        var fnI1 = sinon.spy();
        var fnI = sinon.spy();
        builder.augment(
            on('click').invoke(fn),
            on('click').delegate('.i1').invoke(fnI1),
            on('click').delegate('i').invoke(fnI),
            template('<i class="i1"><u>i1</u></i><i class="i2"><u>i2</u></i>')
        ).register('test-on-delegate');
        var el = document.createElement('test-on-delegate');
        sandbox.appendChild(el);
        var evtI1 = click(el.querySelector('.i1'));
        var evtI2 = click(el.querySelector('.i2'));
        var evtU1 = click(el.querySelector('.i1 u'));
        setTimeout(() => {
            if (canClick()) {
                expect(fn).to.have.been.calledThrice;
                expect(fnI).to.have.been.calledThrice;
                expect(fnI1).to.have.been.calledTwice;
                expect(fnI1).to.be.calledWith(el, evtI1, el.querySelector('.i1'));
                expect(fnI1).to.be.calledWith(el, evtU1, el.querySelector('.i1'));
                expect(evtI1.target).to.eq(el.querySelector('.i1'));
                expect(evtI2.target).to.eq(el.querySelector('.i2'));
            }
            done();
        }, 10);
    });

    it('should skip propagation and default behavior', done => {
        var fn = sinon.spy();
        builder.augment(on('click').skip()).register('test-on-skip');
        var el = document.createElement('test-on-skip');
        sandbox.appendChild(el);
        sandbox.addEventListener('click', fn);
        click(el);
        setTimeout(() => {
            if (canClick()) {
                expect(fn).to.not.have.been.calledOnce;
            }
            sandbox.removeEventListener('click', fn);
            done();
        }, 10);
    });

});
