/*jshint -W030 */

import './ceb-button.js';

describe('ceb-button', () => {
    var sandbox, cebButton;

    beforeEach((done) => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        sandbox.innerHTML = `
            <button is="ceb-button"></button>
        `;
        cebButton = sandbox.querySelector('button');
        setTimeout(() => done(), 100);
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should expose its jquery instance', () => {
        expect(cebButton.$el).to.not.be.undefined;
    });

    it('should be a btn', () => {
        expect(cebButton.getAttribute('class').split((' '))).to.include('btn');
        expect(cebButton.getAttribute('class').split((' '))).to.include('btn-default');
    });

    it('should handle meaning', () => {
        cebButton.altStyle = 'primary';
        expect(cebButton.getAttribute('class').split((' '))).to.include('btn');
        expect(cebButton.getAttribute('class').split((' '))).to.include('btn-primary');
    });

});
