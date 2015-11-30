/*jshint -W030 */

import './ceb-form.js';
import {RULES} from './rules.js';
import {dispatchMouseEvent, dispatchHtmlEvent} from 'ceb';

describe('ceb-form', () => {
    var sandbox, cebForm, submitBtn, resetBtn;

    beforeEach((done) => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        sandbox.innerHTML = `
            <form is="ceb-form" prevent-submit>
                <input name="prop1" value="value1">
                <input name="prop2" value="value2">
                <button type="submit"></button>
                <button type="reset"></button>
            </form>
        `;
        cebForm = sandbox.querySelector('form');
        submitBtn = sandbox.querySelector('[type="submit"]');
        resetBtn = sandbox.querySelector('[type="reset"]');
        setTimeout(() => done(), 100);
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should prevent submit event', (done) => {
        cebForm.addEventListener('submit', function listener(evt) {
            expect(evt.defaultPrevented).to.be.true;
            cebForm.removeEventListener(cebForm, listener);
            done();
        });
        dispatchMouseEvent(submitBtn, 'click');
    });

    it('should prevent native validation', () => {
        expect(cebForm.hasAttribute('novalidate')).to.be.true;
    });

    it('should had builtin rules', () => {
        expect(cebForm.rules).to.have.length(RULES.length);
    });

    it('should add custom rule', () => {
        cebForm.addRule('custom');
        expect(cebForm.rules).to.have.length(RULES.length + 1);
    });

    it('should validate a form control', () => {
        let input = cebForm.elements[0];
        input.required = true;
        input.value = '';
        let state = cebForm.checkFormControlValidity(input);
        expect(state.element, 'element').to.be.eq(input);
        expect(state.valid, 'valid').to.be.false;
        expect(state.invalid, 'invalid').to.be.true;
        expect(state.errors.required, 'required').to.be.true;
    });

    it('should validate the form', () => {
        let input = cebForm.elements[0];
        input.required = true;
        input.value = '';
        let state = cebForm.checkValidity();
        expect(state.form, 'form').to.be.eq(cebForm);
        expect(state.valid, 'valid').to.be.false;
        expect(state.invalid, 'invalid').to.be.true;
        expect(state.controls, 'controls').to.have.length(cebForm.elements.length);
        expect(state.controls[0].valid, 'controls[0]').to.be.false;
        expect(state.controls[1].valid, 'controls[1]').to.be.true;
    });

    it('should report validity', (done) => {
        let input = cebForm.elements[0];
        input.required = true;
        input.value = '';

        cebForm.addEventListener('invalid', function listener(evt) {
            if (evt.target === cebForm) {
                cebForm.removeEventListener(cebForm, listener);
                input.value = 'value1';
                cebForm.reportValidity();
            }
        });

        cebForm.addEventListener('valid', function listener(evt) {
            if (evt.target === cebForm) {
                done();
                cebForm.removeEventListener(cebForm, listener);
            }
        });

        cebForm.reportValidity();
    });

    it('should validate the form on events', (done) => {
        let input = cebForm.elements[0];
        input.required = true;
        input.value = '';

        cebForm.addEventListener('invalid', function listener(evt) {
            if (evt.target === cebForm) {
                cebForm.removeEventListener(cebForm, listener);
                done();
            }
        });

        cebForm.validateOn = 'submit';

        dispatchMouseEvent(submitBtn, 'click');
    });

    it('should validate a control on events', (done) => {
        let input = cebForm.elements[0];
        input.required = true;
        input.value = '';

        cebForm.addEventListener('invalid', function listener(evt) {
            if (evt.target === input) {
                cebForm.removeEventListener(cebForm, listener);
                done();
            }
        });

        cebForm.validateControlOn = 'change';

        dispatchHtmlEvent(input, 'change');
    });

    it('should dispatch valid on reset', (done) => {
        let input = cebForm.elements[0];
        input.required = true;
        input.value = '';

        cebForm.addEventListener('valid', function listener(evt) {
            if (evt.target === cebForm) {
                cebForm.removeEventListener(cebForm, listener);
                done();
            }
        });

        dispatchMouseEvent(resetBtn, 'click');
    });

});
