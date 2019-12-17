import '@webcomponents/webcomponentsjs';
import * as assert from 'assert';
import {AttributeBuilder, AttributeDelegateBuilder, DelegateBuilder, ElementBuilder} from '../src/ceb';
import {getTagName} from './helpers';

describe('AttributeDelegateBuilder', () => {
    let sandbox;
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });
    it('should delegate attribute', () => {
        class ElBuilderShouldDelegateAttrToAttr extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({mode: 'open'});
                this.shadowRoot.innerHTML = `<slot></slot><button></button>`;
            }

            connectedCallback() {
                this.innerHTML = `<input/>`;
            }
        }

        ElementBuilder.get(ElBuilderShouldDelegateAttrToAttr).builder(
            DelegateBuilder.attribute(AttributeBuilder.get('value').default('default value'))
                .to('input'),
            DelegateBuilder.attribute(AttributeBuilder.get('disabled').boolean().default(true))
                .to('input'),
            DelegateBuilder.attribute(AttributeBuilder.get('alt-type').default('text'))
                .to('input').attribute('type'),
            DelegateBuilder.attribute(AttributeBuilder.get('label').default('default label'))
                .to('button').shadow().property('textContent'),
        ).register();
        const tagName = getTagName(ElBuilderShouldDelegateAttrToAttr);
        const element = sandbox.appendChild(document.createElement(tagName)) as ElBuilderShouldDelegateAttrToAttr;
        assert.ok(sandbox.querySelector(tagName));

        assert.strictEqual(element.getAttribute('value'), 'default value');
        assert.strictEqual(element.querySelector('input').getAttribute('value'), 'default value');

        assert.strictEqual(element.hasAttribute('disabled'), true);
        assert.strictEqual(element.querySelector('input').hasAttribute('disabled'), true);

        assert.strictEqual(element.getAttribute('alt-type'), 'text');
        assert.strictEqual(element.querySelector('input').getAttribute('type'), 'text');

        assert.strictEqual(element.getAttribute('label'), 'default label');
        assert.strictEqual(element.shadowRoot.querySelector('button').textContent, 'default label');
    });
});
