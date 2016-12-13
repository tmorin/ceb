/*jshint -W030 */
import {element, template} from '../src/ceb.js';

describe('ceb.template()', () => {
    let sandbox, builder;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = element();
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should apply a string template', () => {
        builder.builders(template(`<button></button>`)).register('ceb-template-string');
        let el = document.createElement('ceb-template-string');
        expect(el.innerHTML).to.be.eq('<button></button>');
    });

    it('should apply a function template', () => {
        builder.builders(template(el => `<button>${el.tagName.toLowerCase()}</button>`)).register('ceb-template-function');
        let el = document.createElement('ceb-template-function');
        expect(el.innerHTML).to.be.eq('<button>ceb-template-function</button>');
    });

    it('should handle content node', (done) => {
        builder.builders(template(`
            <p>pseudo shadow DOM</p>
            <content></content>
            <p>pseudo shadow DOM</p>
        `)).register('ceb-template-node-lightdom');

        sandbox.innerHTML = `
            <ceb-template-node-lightdom>
            <span class="lightdom">light DOM</span>
            </ceb-template-node-lightdom>
        `;

        setTimeout(() => {
            let el = sandbox.querySelector('ceb-template-node-lightdom');
            expect(el.querySelector('.lightdom').textContent).to.be.eq('light DOM');
            expect(el.lightDOM).to.be.eq(el.querySelector('.lightdom').parentNode);
            done();
        }, 20);
    });

    it('should handle ceb-content attribute', (done) => {
        builder.builders(template(`
            <p>pseudo shadow DOM</p>
            <p ceb-content></p>
            <p>pseudo shadow DOM</p>
        `)).register('ceb-template-attr-lightdom');

        sandbox.innerHTML = `
            <ceb-template-attr-lightdom>
            <span class="lightdom">light DOM</span>
            </ceb-template-attr-lightdom>
        `;

        setTimeout(() => {
            let el = sandbox.querySelector('ceb-template-attr-lightdom');
            expect(el.querySelector('.lightdom').textContent).to.be.eq('light DOM');
            expect(el.lightDOM).to.be.eq(el.querySelector('.lightdom').parentNode);
            done();
        }, 20);
    });

    it('should handle embedded light nodes', (done) => {
        element().builders(template(`
            <p id="parent-before">pseudo parent shadow DOM</p>
            <ceb-template-embedded-child><content></content></ceb-template-embedded-child>
            <p id="parent-after">pseudo parent shadow DOM</p>
        `)).register('ceb-template-embedded-parent');

        element().builders(template(`
            <p id="child-before">pseudo child shadow DOM</p>
            <content></content>
            <p id="child-after">pseudo child shadow DOM</p>
        `)).register('ceb-template-embedded-child');

        sandbox.innerHTML = `
            <ceb-template-embedded-parent>
            <span class="lightdom">light DOM</span>
            </ceb-template-embedded-parent>
        `;

        setTimeout(() => {
            let el = sandbox.querySelector('ceb-template-embedded-parent');
            expect(el.lightDOM.textContent.trim()).to.be.eq('light DOM');
            done();
        }, 20);
    });

    it('should handle embedded light nodes v2', (done) => {
        element().builders(template(`
            <p id="parent-before">pseudo parent shadow DOM</p>
            <content></content>
            <p id="parent-after">pseudo parent shadow DOM</p>
        `)).register('ceb-template-embedded-parent-v2');

        element().builders(template(`
            <p id="child-before">pseudo child shadow DOM</p>
            <content></content>
            <p id="child-before">pseudo child shadow DOM</p>
        `)).register('ceb-template-embedded-child-v2');

        sandbox.innerHTML = `
            <ceb-template-embedded-parent-v2 id="parent1">
                <ceb-template-embedded-child-v2 id="child1"><span class="lightdom">light DOM 1</span></ceb-template-embedded-child-v2>
                <ceb-template-embedded-child-v2 id="child2"><span class="lightdom">light DOM 2</span></ceb-template-embedded-child-v2>
            </ceb-template-embedded-parent-v2>
        `;

        setTimeout(() => {
            let el = sandbox.querySelector('ceb-template-embedded-parent-v2');
            expect(el.lightDOM.textContent.trim()).to.be.contain('light DOM');
            expect(el.lightDOM.querySelector('#child1')).to.be.not.null;
            expect(el.lightDOM.querySelector('#child2')).to.be.not.null;
            done();
        }, 20);
    });

    it('should be cloned', (done) => {
        element().builders(template(`
            <p id="parent-before">pseudo parent shadow DOM</p>
            <content></content>
            <p id="parent-after">pseudo parent shadow DOM</p>
        `)).register('ceb-template-clone-parent');

        element().builders(template(`
            <p id="child-before">pseudo child shadow DOM</p>
            <content></content>
            <p id="child-before">pseudo child shadow DOM</p>
        `)).register('ceb-template-clone-child');

        sandbox.innerHTML = `
            <ceb-template-clone-parent id="parent1">
                <ceb-template-clone-child id="child1"><span class="lightdom">light DOM 1</span></ceb-template-clone-child>
                <ceb-template-clone-child id="child2"><span class="lightdom">light DOM 2</span></ceb-template-clone-child>
            </ceb-template-clone-parent>
        `;

        let el = sandbox.querySelector('ceb-template-clone-parent');

        setTimeout(() => {
            let clonedNode = el.cloneNode(true);
            sandbox.appendChild(clonedNode);
            setTimeout(() => {
                expect(clonedNode.tagName).to.be.eq(el.tagName);
                expect(el.lightDOM.querySelector('#child1')).to.be.not.null;
                expect(el.lightDOM.querySelector('#child2')).to.be.not.null;
                done();
            }, 20);
        }, 20);

    });

});
