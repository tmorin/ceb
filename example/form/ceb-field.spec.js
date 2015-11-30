/*jshint -W030 */

import './ceb-field.js';
import {dispatchCustomEvent} from 'ceb';

describe('ceb-field', () => {
    var sandbox, cebField, input1, input2;

    beforeEach((done) => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        sandbox.innerHTML = `
            <ceb-field>
                <input name="prop1" value="value1">
                <input name="prop2" value="value2">
            </ceb-field>
        `;
        cebField = sandbox.querySelector('ceb-field');
        input1 = sandbox.querySelector('[name="prop1"]');
        input2 = sandbox.querySelector('[name="prop2"]');
        setTimeout(() => done(), 10);
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should expose its jquery instance', () => {
        expect(cebField.$el).to.not.be.undefined;
    });

    it('should be a form-group', () => {
        expect(cebField.getAttribute('class')).to.be.eq('form-group');
        expect(cebField.style.display).to.be.eq('block');
    });

    it('should handle validation messages', () => {
        expect(cebField.messages).to.have.ownProperty('required');
        expect(cebField.messages).to.have.ownProperty('minlength');
        expect(cebField.messages).to.have.ownProperty('maxlength');
    });

    it('should report validity', () => {
        cebField._invalidControlStates.push({
            element: input1,
            valid: false,
            invalid: true,
            errors: {
                required: true
            }
        });
        cebField.reportValidity();
        expect(cebField.getAttribute('class')).to.contain('has-error');
        expect(cebField.querySelector('.help-block.errors')).to.exist;

        cebField._invalidControlStates.splice(0, 1);
        cebField.reportValidity();
        expect(cebField.getAttribute('class')).to.not.contain('has-error');
        expect(cebField.querySelector('.help-block.errors')).to.not.exist;
    });

});
