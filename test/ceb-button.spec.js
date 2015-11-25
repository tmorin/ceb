/*jshint -W030 */

import '../example/elements/ceb-button.js';

describe('ceb-button', ()=> {
    var sandbox, cebButton;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        sandbox.appendChild((cebButton = document.createElement('ceb-button')));
        cebButton.name = 'name';
        cebButton.label = 'label';
        cebButton.icon = 'icon';
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should create the button', () => {
        expect(cebButton).to.not.null;
        expect(cebButton.querySelector('button').getAttribute('name')).to.eq('name');
    });

    it('should have a label and an icon', () => {
        expect(cebButton.querySelector('button [x-ref=label]').textContent).to.eq('label');
        expect(cebButton.querySelector('button [x-ref=icon]').textContent).to.eq('icon');
    });

    it('should be disabled when disabled is true and enabled when disabled is false', () => {
        cebButton.disabled = true;
        expect(cebButton.querySelector('button').disabled).to.be.true;
        cebButton.disabled = false;
        expect(cebButton.querySelector('button').disabled).to.be.false;
    });

});
