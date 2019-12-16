import '@webcomponents/webcomponentsjs';
import * as assert from 'assert';
import {ElementBuilder} from '../src/ceb';
import {getTagName} from './helpers';
import {TemplateBuilder} from '../src/template';

describe('TemplateBuilder', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should set HTML template', () => {
        class ShouldSetHtmlTemplate extends HTMLElement {
        }

        ElementBuilder.get(ShouldSetHtmlTemplate)
            .builder(
                TemplateBuilder.get(`<p><input></p>`)
            ).register();
        const tagName = getTagName(ShouldSetHtmlTemplate);
        const element: ShouldSetHtmlTemplate = sandbox.appendChild(document.createElement(tagName));
        assert.ok(sandbox.querySelector(tagName));
        assert.ok(element.querySelector('input'));
    });

    it('should set shadow template', () => {
        class ShouldSetShadowTemplate extends HTMLElement {
        }

        ElementBuilder.get(ShouldSetShadowTemplate)
            .builder(
                TemplateBuilder.get(`<p><input></p>`).shadow()
            ).register();
        const tagName = getTagName(ShouldSetShadowTemplate);
        const element: ShouldSetShadowTemplate = sandbox.appendChild(document.createElement(tagName));
        assert.ok(sandbox.querySelector(tagName));
        assert.ok(element.shadowRoot.querySelector('input'));
    });

});
