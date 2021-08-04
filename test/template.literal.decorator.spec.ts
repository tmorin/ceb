import {assert} from 'chai'
import {ElementBuilder, html, Template, TemplateBuilder} from '../src'

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
            __ceb_preserve_children = true;

            @TemplateBuilder.get().decorate()
            render(): Template {
                return html`
                    <section>
                        <template-decorator-complex-ul></template-decorator-complex-ul>
                    </section>`
            }
        }

        @ElementBuilder.get().name(tagUl).decorate()
        class UlElement extends HTMLElement {
            __ceb_preserve_children = true;
            items?: Array<string>

            @TemplateBuilder.get().decorate()
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

        const sectionElement = sandbox.appendChild(document.createElement(tagUl) as UlElement)
        sectionElement.items = ["A", "B"]
        sectionElement.render()
        assert.strictEqual(sectionElement.querySelectorAll("li").length, 4)
    })
})
