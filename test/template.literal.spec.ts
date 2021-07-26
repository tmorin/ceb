import {assert} from 'chai'
import {getTagName} from './helpers'
import {ElementBuilder, html, TemplateBuilder, Template} from '../src'

describe('template/literal', () => {
    let sandbox

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should template DOM HTML', () => {
        class ShouldSetHtmlTemplate extends HTMLElement {
            name = "Foo"

            render(): Template {
                return html`<p><input value="${this.name}"></p>`
            }
        }

        ElementBuilder.get(ShouldSetHtmlTemplate)
            .builder(
                TemplateBuilder.get()
            ).register()
        const tagName = getTagName(ShouldSetHtmlTemplate)
        const element: ShouldSetHtmlTemplate = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('input'))
        assert.strictEqual(element.querySelector('input').value, "Foo")
        element.name = "Bar"
        element.render()
        assert.strictEqual(element.querySelector('input').value, "Bar")
    })

})
