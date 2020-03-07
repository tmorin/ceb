import * as assert from 'assert';
import {ElementBuilder, TemplateBuilder} from '../src/ceb';

describe('template.decorator', () => {
    let sandbox;
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });
    it('should set shadow template', () => {
        const tagName = 'template-decorator';

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        @TemplateBuilder.template({content: '<p><input></p>', isShadow: true})
        class TestElement extends HTMLElement {
        }

        const element: TestElement = sandbox.appendChild(document.createElement(tagName));
        assert.ok(sandbox.querySelector(tagName));
        assert.ok(element.shadowRoot.querySelector('input'));
    });
});
