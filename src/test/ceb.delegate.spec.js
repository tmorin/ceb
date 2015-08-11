/*jshint -W030 */

import {ceb, property, attribute, delegate} from '../lib/ceb';

describe('delegate()', function () {
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

    xit('should delegate an attribute to the target matching attribute', () => {
        var setter = (el, value) => value + '1';
        var getter = (el, value) => value ? value.toUpperCase() : value;
        builder.augment(
            delegate(attribute('att1').setter(setter)).to('button')
        ).register('test-delegate-attr-to-attr');
        var el = document.createElement('test-delegate-attr-to-attr');
        sandbox.appendChild(el);
        el.setAttribute('att1', 'value');
        expect(el.getAttribute('att1'), 'el@att1').to.be.eq('value1');
        expect(el.querySelector('button').getAttribute('att1'), 'el>button@att1').to.be.eq('value1');
    });

});
