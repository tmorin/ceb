import {assert} from 'chai'
import {ElementBuilder, html, Template, TemplateBuilder} from '../src'
import {Engine} from "../src/template/engine";

describe('template/literal', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should render a simple template', () => {
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
    it('should render a complex template', () => {
        const tagSection = 'template-decorator-complex-section'
        const tagUl = 'template-decorator-complex-ul'

        @ElementBuilder.get().name(tagSection).decorate()
        class SectionElement extends HTMLElement {
            @TemplateBuilder.get().preserveContent().decorate()
            render(): Template {
                return html`
                    <section>
                        <template-decorator-complex-ul></template-decorator-complex-ul>
                    </section>`
            }
        }

        @ElementBuilder.get().name(tagUl).decorate()
        class UlElement extends HTMLElement {
            items?: Array<string>

            connectedCallback() {
                this.setAttribute("class", "test")
            }

            @TemplateBuilder.get().preserveContent().preserveAttributes("class").decorate()
            render(): Template {
                const lis = this.items?.map(item => html`
                    <li o:key="${item}">${item}</li>`)
                return html`
                    <ul>
                        <li>before</li>
                        ${lis}
                        <li>after</li>
                    </ul>`
            }
        }

        const sectionElement = sandbox.appendChild(document.createElement(tagSection) as SectionElement)
        sectionElement.render()

        {
            const ulElement = sandbox.querySelector(tagUl) as UlElement
            // @ts-ignore
            assert.strictEqual(ulElement[Engine.PROP_NAME_PRESERVE_CHILDREN], true)
            // @ts-ignore
            assert.equal(ulElement[Engine.PROP_NAME_PRESERVE_ATTRIBUTES][0], "class")
            ulElement.items = ["A", "B"]
            ulElement.render()
            assert.strictEqual(ulElement.querySelectorAll("li").length, 4)
        }
        sectionElement.render()
        {
            const ulElement = sandbox.querySelector(tagUl) as UlElement
            // @ts-ignore
            assert.strictEqual(ulElement[Engine.PROP_NAME_PRESERVE_CHILDREN], true)
            // @ts-ignore
            assert.equal(ulElement[Engine.PROP_NAME_PRESERVE_ATTRIBUTES][0], "class")
            assert.equal(ulElement.getAttribute("class"), "test")
        }
    })
})
