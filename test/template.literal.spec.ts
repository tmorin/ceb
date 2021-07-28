import {assert} from 'chai'
import {ElementBuilder, html, Template, TemplateBuilder} from '../src'

describe('template/literal', () => {
    let sandbox

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should render into Light DOM', () => {
        const tagName = "template-literal-light"

        class TestElement extends HTMLElement {
            name = "Foo"

            render(): Template {
                return html`<p><input value="${this.name}"></p>`
            }
        }

        ElementBuilder.get(TestElement).name(tagName).builder(
            TemplateBuilder.get()
        ).register()
        const element: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('input'))
        assert.strictEqual(element.querySelector('input').value, "Foo")
        element.name = "Bar"
        element.render()
        assert.strictEqual(element.querySelector('input').value, "Bar")
    })

    it('should render into Shadow DOM', () => {
        const tagName = "template-literal-shadow"

        class TestElement extends HTMLElement {
            name = "Foo"

            render(): Template {
                return html`<p><input value="${this.name}"></p>`
            }
        }

        ElementBuilder.get(TestElement).name(tagName).builder(
            TemplateBuilder.get().shadow()
        ).register()
        const element: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.shadowRoot.querySelector('input'))
        assert.strictEqual(element.shadowRoot.querySelector('input').value, "Foo")
        element.name = "Bar"
        element.render()
        assert.strictEqual(element.shadowRoot.querySelector('input').value, "Bar")
    })

})
