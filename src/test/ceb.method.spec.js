/*jshint -W030 */

import {ceb, method} from '../lib/ceb';

describe('method()', function () {
    var sandbox, builder;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = ceb();
    });

    it('should define a method', () => {
        var meth1 = sinon.spy();
        builder.augment(method('meth1').invoke(meth1)).register('test-method');
        var el = document.createElement('test-method');
        el.meth1(0, 1);
        expect(el.meth1).to.be.an.instanceof(Function);
        expect(meth1).to.have.been.calledWith(el, 0, 1);
    });

    it('should define wrappers', () => {
        var meth1 = sinon.spy();
        var wrapper1 = sinon.spy((next, el, a1, a2) => next(el, a1, a2));
        var wrapper2 = sinon.spy((next, el, a1, a2) => next(el, a1, a2));
        var wrapper3 = sinon.spy((next, el, a1, a2) => next(el, a1, a2));
        builder.augment(method('meth1').invoke(meth1).wrap(wrapper1, wrapper2).wrap(wrapper3)).register('test-method-wrapper');
        var el = document.createElement('test-method-wrapper');
        el.meth1(0, 1);
        expect(el.meth1).to.be.an.instanceof(Function);
        expect(meth1).to.have.been.calledWith(el, 0, 1);
        expect(wrapper1).to.have.been.calledWith(sinon.match(Function), el, 0, 1);
        expect(wrapper2).to.have.been.calledWith(sinon.match(Function), el, 0, 1);
        expect(wrapper3).to.have.been.calledWith(sinon.match(Function), el, 0, 1);
    });

});
