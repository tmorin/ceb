import {assert} from 'chai'
import {ContentBuilder, ElementBuilder} from '../src'
import {getTagName} from './helpers'

describe('content', () => {
    let sandbox

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should set HTML content', () => {
        class ShouldSetHtmlContent extends HTMLElement {
        }

        ElementBuilder.get(ShouldSetHtmlContent)
            .builder(
                ContentBuilder.get(`<p><input></p>`)
            ).register()
        const tagName = getTagName(ShouldSetHtmlContent)
        const element: ShouldSetHtmlContent = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('input'))
    })

    it('should set shadow content', () => {
        class ShouldSetShadowContent extends HTMLElement {
        }

        ElementBuilder.get(ShouldSetShadowContent)
            .builder(
                ContentBuilder.get(`<p><input></p>`).shadow()
            ).register()
        const tagName = getTagName(ShouldSetShadowContent)
        const element: ShouldSetShadowContent = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.shadowRoot.querySelector('input'))
    })

})
