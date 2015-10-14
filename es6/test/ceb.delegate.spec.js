/*jshint -W030 */

import {ceb, property, attribute, method, delegate} from '../lib/ceb.js';

describe('ceb.delegate()', function () {
    var sandbox, builder;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = ceb();
        builder.on('before:createdCallback').invoke(el => {
            el.innerHTML = '<button></button>';
        });
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    /* PROPERTY */

    it('should delegate a property to the target matching property', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            delegate(property('prop1').setter(setter).getter(getter)).to('button')
        ).register('test-delegate-prop-to-prop');
        var el = document.createElement('test-delegate-prop-to-prop');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').prop1, 'el>button.prop1').to.be.eq('value1');
    });

    it('should delegate a property to another target property', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            delegate(property('prop1').setter(setter).getter(getter)).to('button').property('prop1bis')
        ).register('test-delegate-prop-to-alt-prop');
        var el = document.createElement('test-delegate-prop-to-alt-prop');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').prop1bis, 'el>button.prop1bis').to.be.eq('value1');
    });

    it('should delegate a property to the target matching attribute', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            delegate(property('prop1').setter(setter).getter(getter)).to('button').attribute()
        ).register('test-delegate-prop-to-attr');
        var el = document.createElement('test-delegate-prop-to-attr');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').getAttribute('prop1'), 'el>button@prop1').to.be.eq('value1');
    });

    it('should delegate a property to another target attribute', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            delegate(property('prop1').setter(setter).getter(getter)).to('button').attribute('att1')
        ).register('test-delegate-prop-to-alt-attr');
        var el = document.createElement('test-delegate-prop-to-alt-attr');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value1');
    });

    /* ATTRIBUTE */

    it('should delegate an attribute to the target matching attribute', (done) => {
        builder.augment(
            delegate(attribute('att1')).to('button')
        ).register('test-delegate-attr-to-attr');
        var el = document.createElement('test-delegate-attr-to-attr');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value');
            done();
        }, 10);
    });

    it('should delegate an attribute to another target attribute', (done) => {
        builder.augment(
            delegate(attribute('att1')).to('button').attribute('att2')
        ).register('test-delegate-attr-to-alt-attr');
        var el = document.createElement('test-delegate-attr-to-alt-attr');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').getAttribute('att2'), 'el>button@att2').to.be.eq('value');
            done();
        }, 10);
    });

    it('should delegate an attribute to the target matching property', (done) => {
        builder.augment(
            delegate(attribute('att1')).to('button').property()
        ).register('test-delegate-attr-to-prop');
        var el = document.createElement('test-delegate-attr-to-prop');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').att1, 'el>button.att1').to.be.eq('value');
            done();
        }, 10);
    });

    it('should delegate an attribute to another target property', (done) => {
        builder.augment(
            delegate(attribute('att1')).to('button').property('prop1')
        ).register('test-delegate-attr-to-alt-prop');
        var el = document.createElement('test-delegate-attr-to-alt-prop');
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
        builder.augment(
            delegate(method('click')).to('button')
        ).register('test-delegate-meth-to-meth');
        var el = document.createElement('test-delegate-meth-to-meth');
        sandbox.appendChild(el);
        setTimeout(() => {
            var button = el.querySelector('button');
            sinon.spy(button, 'click');
            el.click();

            expect(button.click).to.be.have.been.called;
            done();
        }, 10);
    });

});
