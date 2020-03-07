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
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName));
        assert.ok(sandbox.querySelector(tagName));
        assert.strictEqual(el.altName, "a name");
    });
});
