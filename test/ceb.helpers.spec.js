import {noop, invoke, getSuper} from '../src/ceb.js';

/*jshint -W030 */
describe('helpers', () => {

    it('should get the super prototype', () => {
        class A {
            m1(){}
        }
        class B extends A {
            m2(){}
        }
        const b = new B();
        expect(getSuper(new B()).m1).to.be.instanceof(Function);
        expect(getSuper(new B()).m2).to.to.be.undefined;
    });

    it('should return a function', () => {
        expect(noop()).to.be.instanceof(Function);
    });

    it('should get the super prototype', () => {
        expect(invoke(undefined, 'm1')).to.be.instanceof(Array);
    });

});
/*jshint +W030 */
