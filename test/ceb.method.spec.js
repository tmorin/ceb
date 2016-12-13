import {element, method} from '../src/ceb.js';

/*jshint -W030 */
describe('ceb.method()', function () {
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

    it('should define a method', () => {
        let meth1 = sinon.spy();
        builder.builders(method('meth1').invoke(meth1)).register('test-method');
        let el = document.createElement('test-method');
        el.meth1(0, 1);
        expect(el.meth1).to.be.an.instanceof(Function);
        expect(meth1).to.have.been.calledWith(el, 0, 1);
    });

    it('should define a native method', () => {
        let meth1 = sinon.spy();
        builder.builders(method('meth1').native().invoke(meth1)).register('test-method-native');
        let el = document.createElement('test-method-native');
        el.meth1(0, 1);
        expect(el.meth1).to.be.an.instanceof(Function);
        expect(meth1).to.have.been.calledWith(0, 1);
    });

    it('should define wrappers', () => {
        let meth1 = sinon.spy(function meth1() {
        });

        let wrapper1 = sinon.spy(function wrapper1(next, el, a1, a2) {
            return next(el, a1, a2);
        });

        let wrapper2 = sinon.spy(function wrapper2(next, el, a1, a2) {
            return next(el, a1, a2);
        });

        let wrapper3 = sinon.spy(function wrapper3(next, el, a1, a2) {
            return next(el, a1, a2);
        });

        builder.builders(method('meth1').invoke(meth1).wrap(wrapper1, wrapper2).wrap(wrapper3)).register('test-method-wrapper');
        let el = document.createElement('test-method-wrapper');
        el.meth1(0, 1);
        expect(el.meth1).to.be.an.instanceof(Function);
        expect(meth1, 'meth1').to.have.been.calledWith(el, 0, 1);
        expect(wrapper1, 'wrapper1').to.have.been.calledWith(sinon.match(Object), el, 0, 1);
        expect(wrapper2, 'wrapper2').to.have.been.calledWith(sinon.match(Object), el, 0, 1);
        expect(wrapper3, 'wrapper3').to.have.been.calledWith(sinon.match(Object), el, 0, 1);
    });

    it('should define wrappers on native method', () => {
        let meth1 = sinon.spy(function meth1() {
        });

        let wrapper1 = sinon.spy(function wrapper1(next, a1, a2) {
            return next(a1, a2);
        });

        let wrapper2 = sinon.spy(function wrapper2(next, a1, a2) {
            return next(a1, a2);
        });

        let wrapper3 = sinon.spy(function wrapper3(next, a1, a2) {
            return next(a1, a2);
        });

        builder.builders(method('meth1').native().invoke(meth1).wrap(wrapper1, wrapper2).wrap(wrapper3)).register('test-method-wrapper-native');
        let el = document.createElement('test-method-wrapper-native');
        el.meth1(0, 1);
        expect(el.meth1).to.be.an.instanceof(Function);
        expect(meth1, 'meth1').to.have.been.calledWith(0, 1);
        expect(wrapper1, 'wrapper1').to.have.been.calledWith(sinon.match(Object), 0, 1);
        expect(wrapper2, 'wrapper2').to.have.been.calledWith(sinon.match(Object), 0, 1);
        expect(wrapper3, 'wrapper3').to.have.been.calledWith(sinon.match(Object), 0, 1);
    });

});
/*jshint +W030 */
