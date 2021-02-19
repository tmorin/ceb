import './fix_global';
import * as assert from 'assert';
import {ElementBuilder} from '../src/ceb';

describe('element.decorator', () => {
    let sandbox;
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });
    it('should create with decorator', () => {
        const tagName = 'test-element';

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            altName = 'a name';

            connectedCallback() {
                this.setAttribute('att0', 'val0');
            }
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName));
        assert.ok(sandbox.querySelector(tagName));
        assert.strictEqual(el.altName, 'a name');
        assert.strictEqual(el.getAttribute('att0'), 'val0');
    });
    it('should create a customized built-in element with decorator', () => {
        const tagName = 'input-test';

        @ElementBuilder.element<InputTestElement>({
            name: tagName,
            extends: 'input'
        })
        class InputTestElement extends HTMLInputElement {
            altName = 'a name';

            constructor() {
                super();
            }

            connectedCallback() {
                this.setAttribute('att0', 'val0');
            }
        }

        const el: InputTestElement = sandbox.appendChild(document.createElement('input', {is: tagName}));
        {
            const input = sandbox.querySelector('input');
            assert.ok(input instanceof InputTestElement);
            assert.strictEqual(input.outerHTML, `<input is="${tagName}" att0="val0">`);
        }
        assert.strictEqual(el.altName, 'a name');
        assert.strictEqual(el.getAttribute('att0'), 'val0');
    });
});
