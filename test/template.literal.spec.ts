import {assert} from 'chai'
import {ElementBuilder, html, Template, TemplateBuilder} from '../src'

describe('template/literal', () => {
    let sandbox: HTMLDivElement
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
        const element = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('input'))
        assert.strictEqual(element.querySelector('input')?.value, "Foo")
        element.name = "Bar"
        element.render()
        assert.strictEqual(element.querySelector('input')?.value, "Bar")
    })

    it('should render into Grey DOM', () => {
        const tagName = "template-literal-grey"

        class TestElement extends HTMLElement {
            render(): Template {
                return html`<p>Hello, <ceb-slot></ceb-slot>!</p>`
            }
        }

        ElementBuilder.get(TestElement).name(tagName).builder(
            TemplateBuilder.get().grey()
        ).register()
        sandbox.innerHTML = `<${tagName}>World</${tagName}>`
        const element = sandbox.querySelector(tagName) as TestElement
        assert.strictEqual(element.innerHTML, `<p>Hello, <ceb-slot>World</ceb-slot>!</p>`)
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
        const element = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.shadowRoot?.querySelector('input'))
        assert.strictEqual(element.shadowRoot?.querySelector('input')?.value, "Foo")
        element.name = "Bar"
        element.render()
        assert.strictEqual(element.shadowRoot?.querySelector('input')?.value, "Bar")
    })

})
