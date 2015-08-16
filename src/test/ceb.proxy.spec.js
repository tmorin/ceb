/*jshint -W030 */

import {ceb, property, attribute, proxy} from '../lib/ceb';

describe('proxy()', function () {
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

    /* PROPERTY */

    it('should proxy a property to the target matching property', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            proxy(property('prop1').setter(setter).getter(getter)).to('button')
        ).register('test-proxy-prop-to-prop');
        var el = document.createElement('test-proxy-prop-to-prop');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').prop1, 'el>button.prop1').to.be.eq('value1');
    });

    it('should proxy a property to another target property', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            proxy(property('prop1').setter(setter).getter(getter)).to('button').property('prop1bis')
        ).register('test-proxy-prop-to-alt-prop');
        var el = document.createElement('test-proxy-prop-to-alt-prop');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').prop1bis, 'el>button.prop1bis').to.be.eq('value1');
    });

    it('should proxy a property to the target matching attribute', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            proxy(property('prop1').setter(setter).getter(getter)).to('button').attribute()
        ).register('test-proxy-prop-to-attr');
        var el = document.createElement('test-proxy-prop-to-attr');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').getAttribute('prop1'), 'el>button@prop1').to.be.eq('value1');
    });

    it('should proxy a property to another target attribute', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value.toUpperCase();
        builder.augment(
            proxy(property('prop1').setter(setter).getter(getter)).to('button').attribute('att1')
        ).register('test-proxy-prop-to-alt-attr');
        var el = document.createElement('test-proxy-prop-to-alt-attr');
        sandbox.appendChild(el);
        el.prop1 = 'value';
        expect(el.prop1, 'el.prop1').to.be.eq('VALUE1');
        expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value1');
    });

    /* ATTRIBUTE */

    it('should proxy an attribute to the target matching attribute', (done) => {
        builder.augment(
            proxy(attribute('att1')).to('button')
        ).register('test-proxy-attr-to-attr');
        var el = document.createElement('test-proxy-attr-to-attr');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value');
            done();
        }, 10);
    });

    it('should proxy an attribute to another target attribute', (done) => {
        builder.augment(
            proxy(attribute('att1')).to('button').attribute('att2')
        ).register('test-proxy-attr-to-alt-attr');
        var el = document.createElement('test-proxy-attr-to-alt-attr');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').getAttribute('att2'), 'el>button@att2').to.be.eq('value');
            done();
        }, 10);
    });

    it('should proxy an attribute to the target matching property', (done) => {
        builder.augment(
            proxy(attribute('att1')).to('button').property()
        ).register('test-proxy-attr-to-prop');
        var el = document.createElement('test-proxy-attr-to-prop');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').att1, 'el>button.att1').to.be.eq('value');
            done();
        }, 10);
    });

    it('should proxy an attribute to another target property', (done) => {
        builder.augment(
            proxy(attribute('att1')).to('button').property('prop1')
        ).register('test-proxy-attr-to-alt-prop');
        var el = document.createElement('test-proxy-attr-to-alt-prop');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value');
            expect(el.querySelector('button').prop1, 'el>button.prop1').to.be.eq('value');
            done();
        }, 10);
    });

    it('should proxy an attribute to the target matching attribute with a setter', (done) => {
        var setter = (el, value) => value + '1';
        builder.augment(
            proxy(attribute('att1').setter(setter)).to('button')
        ).register('test-proxy-attr-to-attr-setter');
        var el = document.createElement('test-proxy-attr-to-attr-setter');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        setTimeout(() => {
            expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value1');
            expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value1');
            done();
        }, 10);
    });

});
