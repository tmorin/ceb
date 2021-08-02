import {assert} from 'chai'
import {ElementBuilder, html, Template, TemplateBuilder} from '../src'

describe('template/literal', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should template DOM HTML', () => {
        const tagName = 'template-decorator'

        @ElementBuilder.get().name(tagName).decorate()
        class TestElement extends HTMLElement {
            name = "Foo"

            @TemplateBuilder.get().decorate()
            render(): Template {
                return html`<p><input value="${this.name}"></p>`
            }
        }

        const element = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('input'))
        assert.strictEqual(element.querySelector('input')?.value, "Foo")
        element.name = "Bar"
        element.render()
        assert.strictEqual(element.querySelector('input')?.value, "Bar")
    })

})
