/*jshint -W030 */

import {ceb, template, on} from '../lib/ceb.js';
import {canClick, click} from './helper.js';

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
        builder.builders(on('click').invoke(fn), template('<button>button</button>')).register('test-on-bubbling');
        var el = document.createElement('test-on-bubbling');
        sandbox.appendChild(el);
        click(el);
        setTimeout(() => {
            if (canClick()) {
                expect(fn).to.have.been.calledOnce;
                expect(fn).to.be.calledWith(el, sinon.match(Object));
            }
            done();
        }, 10);
    });

    it('should invoke during the capture phase', done => {
        var fn = sinon.spy();
        builder.builders(on('click').invoke(fn).capture(), template('<button>button</button>')).register('test-on-capture');
        var el = document.createElement('test-on-capture');
        sandbox.appendChild(el);
        click(el);
        setTimeout(() => {
            if (canClick()) {
                expect(fn).to.have.been.calledOnce;
                expect(fn).to.be.calledWith(el, sinon.match(Object));
            }
            done();
        }, 10);
    });

    it('should invoke on delegate events', done => {
        var fn = sinon.spy();
        var fnI1 = sinon.spy();
        var fnI = sinon.spy();
        builder.builders(
            on('click').invoke(fn),
            on('click').delegate('.i1').invoke(fnI1),
            on('click').delegate('i').invoke(fnI),
            template(`<i class="i1"><b>i1</b></i><i class="i2"><b>i2</b></i>`)
        ).register('test-on-delegate');
        var el = document.createElement('test-on-delegate');
        sandbox.appendChild(el);
        click(el.querySelector('.i1'));
        click(el.querySelector('.i2'));
        click(el.querySelector('.i1 b'));
        setTimeout(() => {
            if (canClick()) {
                expect(fn).to.have.been.calledThrice;
                expect(fnI).to.have.been.calledThrice;
                expect(fnI1).to.have.been.calledTwice;
                expect(fnI1).to.be.calledWith(el, sinon.match(Object), el.querySelector('.i1'));
                expect(fnI1).to.be.calledWith(el, sinon.match(Object), el.querySelector('.i1'));
                expect(fnI1.getCall(0).args[1].target).to.eq(el.querySelector('.i1'));
                expect(fnI.getCall(1).args[1].target).to.eq(el.querySelector('.i2'));
            }
            done();
        }, 10);
    });

    it('should skip propagation and default behavior', done => {
        var fn = sinon.spy();
        builder.builders(on('click').skip()).register('test-on-skip');
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
