/*jshint -W030 */

import {ceb, attribute} from '../lib/ceb';

describe('ceb.attribute()', function () {
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

    it('should define an attribute', () => {
        builder.augment(attribute('att1')).register('test-attribute');
        var el = document.createElement('test-attribute');
        el.setAttribute('att1', 'value');
        expect(el.att1).to.be.eq('value');
        expect(el.getAttribute('att1')).to.be.eq('value');
    });

    it('should define an attribute with a default value', (done) => {
        builder.augment(attribute('att1').value('default')).register('test-attribute-default');
        var el = document.createElement('test-attribute-default');
        setTimeout(function () {
            expect(el.att1).to.be.eq('default');
            expect(el.getAttribute('att1')).to.be.eq('default');
            done();
        }, 10);
    });

    it('should define an attribute binded to the same property name', () => {
        builder.augment(attribute('att1')).register('test-binded-attribute');
        var el = document.createElement('test-binded-attribute');
        el.att1 = 'fromProp';
        expect(el.att1).to.be.eq('fromProp');
        expect(el.getAttribute('att1')).to.be.eq('fromProp');
        el.setAttribute('att1', 'fromAtt');
        expect(el.att1).to.be.eq('fromAtt');
        expect(el.getAttribute('att1')).to.be.eq('fromAtt');
    });

    it('should define an attribute binded to another property name', () => {
        builder.augment(attribute('att1').property('prop1')).register('test-alt-binded-attribute');
        var el = document.createElement('test-alt-binded-attribute');
        el.prop1 = 'fromProp';
        expect(el.prop1).to.be.eq('fromProp');
        expect(el.getAttribute('att1')).to.be.eq('fromProp');
        el.setAttribute('att1', 'fromAtt');
        expect(el.prop1).to.be.eq('fromAtt');
        expect(el.getAttribute('att1')).to.be.eq('fromAtt');
    });

    it('should define setter for attribute', () => {
        var setter = (el, value) => value + '1';
        builder.augment(attribute('att1').setter(setter)).register('test-setter-attribute');
        var el = document.createElement('test-setter-attribute');

        el.att1 = 'fromProp';
        expect(el.att1).to.be.eq('fromProp1');
        expect(el.getAttribute('att1')).to.be.eq('fromProp1');

        el.setAttribute('att1', 'fromAtt');
        expect(el.att1).to.be.eq('fromAtt');
        expect(el.getAttribute('att1')).to.be.eq('fromAtt');
    });

    it('should not define getter for attribute', () => {
        var getter = (el, value) => value + '1';
        builder.augment(attribute('att1').getter(getter)).register('test-getter-attribute');
        var el = document.createElement('test-getter-attribute');

        el.att1 = 'fromProp';
        expect(el.att1).to.be.eq('fromProp');
        expect(el.getAttribute('att1')).to.be.eq('fromProp');

        el.setAttribute('att1', 'fromAtt');
        expect(el.att1).to.be.eq('fromAtt');
        expect(el.getAttribute('att1')).to.be.eq('fromAtt');
    });

});

