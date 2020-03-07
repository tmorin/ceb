import * as assert from 'assert';
import {ElementBuilder, ReferenceBuilder} from '../src/ceb';

describe('reference.decorator', () => {
    let sandbox;
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });
    it('should manage reference', () => {
        const tagName = 'reference-decorator';

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            @ReferenceBuilder.reference({isShadow: true, selector: 'ul'})
            readonly ul: HTMLUListElement;
            @ReferenceBuilder.reference({isShadow: true})
            readonly anId: HTMLUListElement;
            @ReferenceBuilder.reference({isShadow: true, isArray: true, selector: 'li'})
            readonly lis: Array<HTMLLIElement>;
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName));
        el.attachShadow({mode: 'open'});
        el.shadowRoot.innerHTML = `<ul id="anId"><li class="li0"></li><li class="li0"></li></ul>`;
        assert.ok(sandbox.querySelector(tagName));
        assert.ok(el.ul);
        assert.strictEqual(el.ul.tagName, 'UL');
        assert.ok(el.anId);
        assert.strictEqual(el.anId.tagName, 'UL');
        assert.ok(el.lis);
        assert.strictEqual(el.lis.length, 2);
    });
});
