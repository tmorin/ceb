import {assert} from 'chai'
import {ElementBuilder, html, TemplateBuilder, Template} from '../src'

describe('template/literal', () => {
    let sandbox

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should template DOM HTML', () => {
        const tagName = 'template-decorator'

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            name = "Foo"

            @TemplateBuilder.template()
            render(): Template {
                return html`<p><input value="${this.name}"></p>`
            }
        }

        const element: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('input'))
        assert.strictEqual(element.querySelector('input').value, "Foo")
        element.name = "Bar"
        element.render()
        assert.strictEqual(element.querySelector('input').value, "Bar")
    })

})
