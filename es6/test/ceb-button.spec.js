/*jshint -W030 */

import '../example/ceb-button';
import {canClick, click} from './helper';

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
        //sandbox.innerHTML = '';
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

    it('should have the label "clicked" when clicked', done => {
        click(cebButton.querySelector('button'));
        setTimeout(() => {
            if (canClick()) {
                expect(cebButton.querySelector('button [x-ref=label]').textContent).to.eq('clicked');
            }
            done();
        }, 10);
    });

    it('should have the label "label" when clicked twice', done => {
        click(cebButton.querySelector('button'));
        click(cebButton.querySelector('button'));
        setTimeout(() => {
            if (canClick()) {
                expect(cebButton.querySelector('button [x-ref=label]').textContent).to.eq('label');
            }
            done();
        }, 10);
    });

    it('should handle attribute value when created', done => {
        sandbox.innerHTML = '<ceb-button icon="icon" label="label"></ceb-button>';
        setTimeout(() => {
            var el = sandbox.querySelector('ceb-button');
            expect(el.querySelector('button [x-ref=icon]').textContent).to.eq('icon');
            expect(el.querySelector('button [x-ref=label]').textContent).to.eq('label');
            done();
        }, 30);
    });

});
