import './fix_global';
import * as assert from 'assert';
import {ElementBuilder} from '../src/ceb';
import {getTagName} from './helpers';
import {ReferenceBuilder} from '../src/reference';

describe('reference', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should get reference from public DOM', () => {
        class ShouldGetFromPublicDOM extends HTMLElement {
            readonly ul: HTMLUListElement;
            readonly lis: Array<HTMLLIElement>;
        }

        ElementBuilder.get(ShouldGetFromPublicDOM)
            .builder(
                ReferenceBuilder.get('ul').selector('ul'),
                ReferenceBuilder.get('lis').selector('li').array()
            ).register();
        const tagName = getTagName(ShouldGetFromPublicDOM);
        const element: ShouldGetFromPublicDOM = sandbox.appendChild(document.createElement(tagName));
        element.innerHTML = `<ul><li class="li0"></li><li class="li0"></li></ul>`;
        assert.ok(sandbox.querySelector(tagName));
        assert.ok(element.ul);
        assert.strictEqual(element.ul.tagName, 'UL');
        assert.ok(element.lis);
        assert.strictEqual(element.lis.length, 2);
    });

    it('should get reference from shadow DOM', () => {
        class ShouldGetFromShadowDOM extends HTMLElement {
            readonly ul: HTMLUListElement;
            readonly anId: HTMLUListElement;
            readonly lis: Array<HTMLLIElement>;
        }

        ElementBuilder.get(ShouldGetFromShadowDOM)
            .builder(
                ReferenceBuilder.get('ul').selector('ul').shadow(),
                ReferenceBuilder.get('anId').shadow(),
                ReferenceBuilder.get('lis').selector('li').array().shadow()
            ).register();
        const tagName = getTagName(ShouldGetFromShadowDOM);
        const element: ShouldGetFromShadowDOM = sandbox.appendChild(document.createElement(tagName));
        element.attachShadow({mode: 'open'});
        element.shadowRoot.innerHTML = `<ul id="anId"><li class="li0"></li><li class="li0"></li></ul>`;
        assert.ok(sandbox.querySelector(tagName));
        assert.ok(element.ul);
        assert.strictEqual(element.ul.tagName, 'UL');
        assert.ok(element.anId);
        assert.strictEqual(element.anId.tagName, 'UL');
        assert.ok(element.lis);
        assert.strictEqual(element.lis.length, 2);
    });

});
