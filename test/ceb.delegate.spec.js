/*jshint -W030 */
import {element, property, attribute, method, delegate} from '../src/ceb.js';

describe('ceb.delegate()', function () {
    let sandbox, builder;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = element();
        builder.on('before:createdCallback').invoke(el => {
            el.innerHTML = '<button></button>';
        });
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    /* PROPERTY */

    it('should delegate a property to the target matching property', () => {
        let setter = (el, value) => value + '1';
        let getter = (el, value) => value.toUpperCase();
        builder.builders(
            delegate(property('prop1').setter(setter).getter(getter)).to('button')
        ).register('test-delegate-prop-to-prop');
        let el = document.createElement('test-delegate-prop-to-prop');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').prop1, 'el>button.prop1').to.be.eq('value1');
    });

    it('should delegate a property to another target property', () => {
        let setter = (el, value) => value + '1';
        let getter = (el, value) => value.toUpperCase();
        builder.builders(
            delegate(property('prop1').setter(setter).getter(getter)).to('button').property('prop1bis')
        ).register('test-delegate-prop-to-alt-prop');
        let el = document.createElement('test-delegate-prop-to-alt-prop');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').prop1bis, 'el>button.prop1bis').to.be.eq('value1');
    });

    it('should delegate a property to the target matching attribute', () => {
        let setter = (el, value) => value + '1';
        let getter = (el, value) => value.toUpperCase();
        builder.builders(
            delegate(property('prop1').setter(setter).getter(getter)).to('button').attribute()
        ).register('test-delegate-prop-to-attr');
        let el = document.createElement('test-delegate-prop-to-attr');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').getAttribute('prop1'), 'el>button@prop1').to.be.eq('value1');
    });

    it('should delegate a property to another target attribute', () => {
        let setter = (el, value) => value + '1';
        let getter = (el, value) => value.toUpperCase();
        builder.builders(
            delegate(property('prop1').setter(setter).getter(getter)).to('button').attribute('att1')
        ).register('test-delegate-prop-to-alt-attr');
        let el = document.createElement('test-delegate-prop-to-alt-attr');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value1');
    });

    /* ATTRIBUTE */

    it('should delegate an attribute to the target matching attribute', (done) => {
        builder.builders(
            delegate(attribute('att1')).to('button')
        ).register('test-delegate-attr-to-attr');
        let el = document.createElement('test-delegate-attr-to-attr');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value');
            done();
        }, 10);
    });

    it('should delegate an attribute to another target attribute', (done) => {
        builder.builders(
            delegate(attribute('att1')).to('button').attribute('att2')
        ).register('test-delegate-attr-to-alt-attr');
        let el = document.createElement('test-delegate-attr-to-alt-attr');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').getAttribute('att2'), 'el>button@att2').to.be.eq('value');
            done();
        }, 10);
    });

    it('should delegate an attribute to the target matching property', (done) => {
        builder.builders(
            delegate(attribute('att1')).to('button').property()
        ).register('test-delegate-attr-to-prop');
        let el = document.createElement('test-delegate-attr-to-prop');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').att1, 'el>button.att1').to.be.eq('value');
            done();
        }, 10);
    });

    it('should delegate an attribute to another target property', (done) => {
        builder.builders(
            delegate(attribute('att1')).to('button').property('prop1')
        ).register('test-delegate-attr-to-alt-prop');
        let el = document.createElement('test-delegate-attr-to-alt-prop');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').prop1, 'el>button.prop1').to.be.eq('value');
            done();
        }, 10);
    });

    /* METHOD */

    it('should delegate a method invocation to the target matching method', (done) => {
        builder.builders(
            delegate(method('click')).to('button')
        ).register('test-delegate-meth-to-meth');
        let el = document.createElement('test-delegate-meth-to-meth');
        sandbox.appendChild(el);
        setTimeout(() => {
            let button = el.querySelector('button');
            sinon.spy(button, 'click');
            el.click();

            expect(button.click).to.be.have.been.called;
            done();
        }, 10);
    });

    it('should delegate a method invocation to the target another method', (done) => {
        builder.builders(
            delegate(method('do')).to('button').method('click')
        ).register('test-delegate-meth-to-alt-meth');
        let el = document.createElement('test-delegate-meth-to-alt-meth');
        sandbox.appendChild(el);
        setTimeout(() => {
            let button = el.querySelector('button');
            sinon.spy(button, 'click');
            el.do();

            expect(button.click).to.be.have.been.called;
            done();
        }, 10);
    });

});
