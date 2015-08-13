/*jshint -W030 */

import {ceb} from '../lib/ceb';

describe('ceb()', () => {

    var sandbox, builder, before, after;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = ceb();
        before = sinon.spy();
        after = sinon.spy();
    });

    it('should handle the extends and prototype', () => {
        var CustomElement = builder
            .extends('button')
            .proto(Object.create(HTMLButtonElement.prototype))
            .register('test-button');
        expect(CustomElement).to.exists;

    });

    it('should handle before:builders and after:builders', () => {
        builder
            .on('before:builders').invoke(before)
            .on('after:builders').invoke(after)
            .register('test-builders');
        expect(before).to.have.been.calledOnce;
        expect(before).to.have.been.calledWith(builder.data);
        expect(after).to.have.been.calledOnce;
        expect(after).to.have.been.calledWith(builder.data);
    });

    it('should handle before:registerElement and after:registerElement', () => {
        var CustomElement = builder
            .on('before:registerElement').invoke(before)
            .on('after:registerElement').invoke(after)
            .register('test-registerElement');
        expect(before).to.have.been.calledOnce;
        expect(before).to.have.been.calledWith(builder.data);
        expect(after).to.have.been.calledOnce;
        expect(after).to.have.been.calledWith(CustomElement);
    });

    it('should handle before:createdCallback and after:createdCallback', () => {
        builder
            .on('before:createdCallback').invoke(before)
            .on('after:createdCallback').invoke(after)
            .register('test-createdCallback');
        var el = document.createElement('test-createdCallback');
        expect(before).to.have.been.calledOnce;
        expect(before).to.have.been.calledWith(sinon.match(el));
        expect(after).to.have.been.calledOnce;
        expect(after).to.have.been.calledWith(sinon.match(el));

    });

    it('should handle before:attachedCallback and after:attachedCallback', done => {
        builder
            .on('before:attachedCallback').invoke(before)
            .on('after:attachedCallback').invoke(after)
            .register('test-attachedCallback');
        var el = document.createElement('test-attachedCallback');
        sandbox.appendChild(el);
        setTimeout(() => {
            expect(before).to.have.been.calledOnce;
            expect(before).to.have.been.calledWith(sinon.match(el));
            expect(after).to.have.been.calledOnce;
            expect(after).to.have.been.calledWith(sinon.match(el));
            done();
        }, 10);
    });

    it('should handle before:detachedCallback and after:detachedCallback', done => {
        builder
            .on('before:detachedCallback').invoke(before)
            .on('after:detachedCallback').invoke(after)
            .register('test-detachedCallback');
        var el = document.createElement('test-detachedCallback');
        sandbox.appendChild(el);
        el.parentNode.removeChild(el);
        setTimeout(() => {
            expect(before).to.have.been.calledOnce;
            expect(before).to.have.been.calledWith(sinon.match(el));
            expect(after).to.have.been.calledOnce;
            expect(after).to.have.been.calledWith(sinon.match(el));
            done();
        }, 10);
    });

    it('should handle before:attributeChangedCallback and after:attributeChangedCallback', done => {
        builder
            .on('before:attributeChangedCallback').invoke(before)
            .on('after:attributeChangedCallback').invoke(after)
            .register('test-attributeChangedCallback');
        var el = document.createElement('test-attributeChangedCallback');
        el.setAttribute('name', 'value');
        setTimeout(() => {
            expect(before).to.have.been.calledOnce;
            expect(before).to.have.been.calledWith(sinon.match(el));
            expect(after).to.have.been.calledOnce;
            expect(after).to.have.been.calledWith(sinon.match(el));
            done();
        }, 10);
    });

    it('should handle augment', done => {
        var build = sinon.spy();
        builder.augment({build}).register('test-augment');
        setTimeout(() => {
            expect(build).to.have.been.calledOnce;
            expect(build).to.have.been.calledWith(sinon.match(builder.data.proto), sinon.match(builder.on));
            done();
        }, 10);
    });

});