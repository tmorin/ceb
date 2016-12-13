/*jshint -W030 */
import {element} from '../src/ceb.js';

describe('ceb.element()', () => {
    let sandbox, builder, before, after;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = element();
        before = sinon.spy();
        after = sinon.spy();
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should handle prototype and extends value', () => {
        builder.base(Object.create(HTMLButtonElement.prototype, {test: {value: 'test'}}), 'button').register('test-prototype-extends');
        let customElement = document.createElement('button', 'test-prototype-extends');
        expect(customElement.test).to.be.an.eq('test');
    });

    it('should handle extends and prototype value', () => {
        builder.base('button', Object.create(HTMLButtonElement.prototype, {test: {value: 'test'}})).register('test-extends-prototype');
        let customElement = document.createElement('button', 'test-extends-prototype');
        expect(customElement.test).to.be.an.eq('test');
    });

    it('should handle prototype value', () => {
        builder.base(Object.create(HTMLButtonElement.prototype, {test: {value: 'test'}})).register('test-prototype');
        let customElement = document.createElement('test-prototype');
        expect(customElement.test).to.be.an.eq('test');
    });

    it('should handle extends value', () => {
        builder.base('button').register('test-extends');
        let customElement = document.createElement('button', 'test-extends');
        expect(customElement).to.exists;
    });

    it('should handle before:builders and after:builders', () => {
        builder
            .on('before:builders').invoke(before)
            .on('after:builders').invoke(after)
            .register('test-builders');
        expect(before).to.have.been.calledOnce;
        expect(before).to.have.been.calledWith(builder.context);
        expect(after).to.have.been.calledOnce;
        expect(after).to.have.been.calledWith(builder.context);
    });

    it('should handle before:registerElement and after:registerElement', () => {
        let CustomElement = builder
            .on('before:registerElement').invoke(before)
            .on('after:registerElement').invoke(after)
            .register('test-registerElement');
        expect(before).to.have.been.calledOnce;
        expect(before).to.have.been.calledWith(builder.context);
        expect(after).to.have.been.calledOnce;
        expect(after).to.have.been.calledWith(CustomElement);
    });

    it('should handle before:createdCallback and after:createdCallback', () => {
        builder
            .on('before:createdCallback').invoke(before)
            .on('after:createdCallback').invoke(after)
            .register('test-createdCallback');
        let el = document.createElement('test-createdCallback');
        expect(before).to.have.been.calledOnce;
        expect(before).to.have.been.calledWith(sinon.match(el));
        expect(after).to.have.been.calledOnce;
        expect(after).to.have.been.calledWith(sinon.match(el));

    });

    it('should handle before:detachedCallback and after:detachedCallback', done => {
        builder
            .on('before:detachedCallback').invoke(before)
            .on('after:detachedCallback').invoke(after)
            .register('test-detachedCallback');
        let el = document.createElement('test-detachedCallback');
        sandbox.appendChild(el);
        setTimeout(() => {
            sandbox.removeChild(el);
            setTimeout(() => {
                expect(before).to.have.been.calledOnce;
                expect(before).to.have.been.calledWith(sinon.match(el));
                expect(after).to.have.been.calledOnce;
                expect(after).to.have.been.calledWith(sinon.match(el));
                done();
            }, 20);
        }, 0);
    });

    it('should handle before:attachedCallback and after:attachedCallback', done => {
        builder
            .on('before:attachedCallback').invoke(before)
            .on('after:attachedCallback').invoke(after)
            .register('test-attachedCallback');
        let el = document.createElement('test-attachedCallback');
        sandbox.appendChild(el);
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
        let el = document.createElement('test-attributeChangedCallback');
        el.setAttribute('name', 'value');
        setTimeout(() => {
            expect(before).to.have.been.calledOnce;
            expect(before).to.have.been.calledWith(sinon.match(el));
            expect(after).to.have.been.calledOnce;
            expect(after).to.have.been.calledWith(sinon.match(el));
            done();
        }, 10);
    });

    it('should handle builders', done => {
        let build = sinon.spy();
        builder.builders({build: build}).register('test-builders-handlers');
        setTimeout(() => {
            expect(build).to.have.been.calledOnce;
            expect(build).to.have.been.calledWith(sinon.match(Object), sinon.match(builder.on));
            done();
        }, 10);
    });

});
