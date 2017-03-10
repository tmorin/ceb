import {element, attribute} from '../src/ceb.js';

/*jshint -W030 */
describe('ceb.attribute()', () => {
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

    it('should define an attribute', () => {
        builder.builders(attribute('att1')).register('test-attribute');
        let el = document.createElement('test-attribute');
        el.setAttribute('att1', 'value');
        expect(el.att1).to.be.eq('value');
        expect(el.getAttribute('att1')).to.be.eq('value');
    });

    it('should define an unbound attribute', () => {
        builder.builders(attribute('att1').unbound()).register('test-unbound-attribute');
        let el = document.createElement('test-unbound-attribute');
        el.setAttribute('att1', 'fromAttr');
        expect(el.att1).to.be.undefined;
        expect(el.getAttribute('att1')).to.be.eq('fromAttr');
        el.att1 = 'fromProp';
        expect(el.att1).to.be.eq('fromProp');
        expect(el.getAttribute('att1')).to.be.eq('fromAttr');
    });

    it('should define an attribute with a default value', (done) => {
        builder.builders(attribute('att1').value('default')).register('test-attribute-default');
        let el = document.createElement('test-attribute-default');
        setTimeout(function () {
            expect(el.att1).to.be.eq('default');
            expect(el.getAttribute('att1')).to.be.eq('default');
            done();
        }, 10);
    });

    it('should define an attribute bound to the same property name', () => {
        builder.builders(attribute('att1')).register('test-bound-attribute');
        let el = document.createElement('test-bound-attribute');
        el.att1 = 'fromProp';
        expect(el.att1).to.be.eq('fromProp');
        expect(el.getAttribute('att1')).to.be.eq('fromProp');
        el.setAttribute('att1', 'fromAtt');
        expect(el.att1).to.be.eq('fromAtt');
        expect(el.getAttribute('att1')).to.be.eq('fromAtt');
    });

    it('should define an attribute bound to another property name', () => {
        builder.builders(attribute('att1').property('prop1')).register('test-alt-bound-attribute');
        let el = document.createElement('test-alt-bound-attribute');
        el.prop1 = 'fromProp';
        expect(el.prop1).to.be.eq('fromProp');
        expect(el.getAttribute('att1')).to.be.eq('fromProp');
        el.setAttribute('att1', 'fromAtt');
        expect(el.prop1).to.be.eq('fromAtt');
        expect(el.getAttribute('att1')).to.be.eq('fromAtt');
    });

    it('should define listener for attribute', (done) => {
        let listener = sinon.spy();
        builder.builders(attribute('att1').listen(listener)).register('test-listener-attribute');
        let el = document.createElement('test-listener-attribute');
        el.att1 = 'fromProp';
        setTimeout(() => {
            expect(listener).to.have.been.calledOnce;
            expect(listener).to.have.been.calledWith(el, null, 'fromProp');
            el.setAttribute('att1', 'fromAttr');
            setTimeout(() => {
                expect(listener).to.have.been.calledTwice;
                expect(listener).to.have.been.calledWith(el, 'fromProp', 'fromAttr');
                done();
            }, 10);
        }, 10);
    });

    it('should define listener for boolean attribute', (done) => {
        const listener = sinon.spy();
        builder.builders(attribute('att1').boolean().listen(listener)).register('test-listener-boolean-attribute');
        const el = document.createElement('test-listener-boolean-attribute');
        el.att1 = true;
        setTimeout(() => {
            expect(listener, 'listener').to.have.been.calledOnce;
            expect(listener, 'listener').to.have.been.calledWith(el, false, true);
            el.removeAttribute('att1');
            setTimeout(() => {
                expect(listener, 'listener').to.have.been.calledTwice;
                expect(listener, 'listener').to.have.been.calledWith(el, true, false);
                done();
            }, 10);
        }, 10);
    });

    it('should handle extended callback', (done) => {
        const listener1 = sinon.spy();
        const listener2 = sinon.spy();
        const listener3 = sinon.spy();

        const TestExtendElement1 = element()
            .builders(attribute('att1').listen(listener1), attribute('att2').listen(listener2))
            .register('test-extend-element1');

        element()
            .base(Object.create(TestExtendElement1.prototype))
            .builders(attribute('att2').listen(listener2), attribute('att3').listen(listener3))
            .register('test-extend-element2');

        let el = document.createElement('test-extend-element2');
        //console.info(el.tagName, 'created!');

        el.att1 = 'val1';
        el.att2 = 'val2';
        // el.att3 = 'val3';
        setTimeout(() => {
            expect(listener1, 'listener1').to.have.been.calledOnce;
            expect(listener2, 'listener2').to.have.been.calledTwice;
            expect(listener2, 'listener3').to.have.been.notCalled;
            expect(listener1, 'listener1 arguments').to.have.been.calledWith(el, null, 'val1');
            expect(listener2, 'listener2 arguments').to.have.been.calledWith(el, null, 'val2');

            listener1.reset();
            listener2.reset();
            listener3.reset();

            el.removeAttribute('att1');
            el.att3 = 'val3';

            setTimeout(() => {
                expect(listener1, 'listener1').to.have.been.calledOnce;
                expect(listener2, 'listener2').to.have.been.notCalled;
                expect(listener3, 'listener3').to.have.been.calledOnce;
                expect(listener1, 'listener1 arguments').to.have.been.calledWith(el, 'val1', null);
                expect(listener3, 'listener3 arguments').to.have.been.calledWith(el, null, 'val3');
                done();
            }, 10);
        }, 10);
    });

});
/*jshint +W030 */
