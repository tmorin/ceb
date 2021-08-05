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
        const items = ["A", "B", "C"].map(id => ({id, title: id, completed: false}))

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
            items?: Array<{ id: string, title: string, completed: boolean }>

            connectedCallback() {
                this.setAttribute("class", "test")
            }

            @TemplateBuilder.get().preserveContent().preserveAttributes("class").decorate()
            render(): Template {
                const lis = this.items?.map(item => html`
                    <li o:key="${item.id}">
                        <input type="checkbox" checked="${item.completed}">
                        <label>${item.title}</label>
                    </li>`)
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
            ulElement.items = [...items]
            ulElement.render()
            assert.strictEqual(ulElement.querySelectorAll("li").length, 5)
        }
        sectionElement.render()
        {
            const ulElement = sandbox.querySelector(tagUl) as UlElement
            ulElement.items = [...items]
            ulElement.items[1].completed = true
            ulElement.render()
            const inputB = ulElement.querySelectorAll("li input")[1] as HTMLInputElement
            assert.strictEqual(inputB.checked, true)
            assert.strictEqual(inputB.getAttribute("checked"), "")
        }
        sectionElement.render()
        {
            const ulElement = sandbox.querySelector(tagUl) as UlElement
            ulElement.items = [...items].map(item => ({...item, completed: true}))
            ulElement.render()
            const inputB = ulElement.querySelectorAll("li input")[1] as HTMLInputElement
            assert.strictEqual(inputB.checked, true)
            assert.strictEqual(inputB.getAttribute("checked"), "")
        }
        sectionElement.render()
        {
            const ulElement = sandbox.querySelector(tagUl) as UlElement
            ulElement.items = [...items].map(item => ({...item, completed: false}))
            ulElement.render()
            const inputB = ulElement.querySelectorAll("li input")[1] as HTMLInputElement
            assert.strictEqual(inputB.checked, false)
            assert.strictEqual(inputB.hasAttribute("name"), false)
        }
    })
    describe("a custom element displaying a todo list", function () {
        type Todo = { id: string, title: string, completed: boolean }
        const todos: Array<Todo> = [
            {id: "A", title: "A", completed: true},
            {id: "B", title: "B", completed: false}
        ]
        const tagName = 'template-decorator-render-key'
        let element: TestElement

        @ElementBuilder.get().name(tagName).decorate()
        class TestElement extends HTMLElement {
            todos: Array<Todo> = []

            @TemplateBuilder.get().decorate()
            render() {
                const lis = this.todos.map(todo => html`
                    <li o:key="${todo.id}">
                        <input type="checkbox" checked="${todo.completed}"/>
                        ${todo.title}
                    </li>`)
                return html`
                    <ul>${lis}</ul>`
            }
        }

        beforeEach(function () {
            element = sandbox.appendChild(document.createElement(tagName) as TestElement)
            element.todos = [...todos]
        })

        it("should render items when filtering the list", function () {
            element.todos = [...todos].slice(0, 1)
            assert.equal(element.todos[0].title, "A")
            element.render()
            assert.equal(element.querySelectorAll("li")[0].textContent?.trim(), "A")

            element.todos = [...todos].slice(1, 2)
            assert.equal(element.todos[0].title, "B")
            element.render()
            assert.equal(element.querySelectorAll("li")[0].textContent?.trim(), "B")

            element.todos = [...todos]
            assert.equal(element.todos[0].title, "A")
            assert.equal(element.todos[1].title, "B")
            element.render()
            assert.equal(element.querySelectorAll("li")[0].textContent?.trim(), "A")
            assert.equal(element.querySelectorAll("li")[1].textContent?.trim(), "B")

            element.todos = [...todos, {id: "C", title: "C", completed: true}]
            assert.equal(element.todos.length, 3)
            assert.equal(element.todos[0].title, "A")
            assert.equal(element.todos[1].title, "B")
            assert.equal(element.todos[2].title, "C")
            element.render()
            assert.equal(element.querySelectorAll("li")[0].textContent?.trim(), "A")
            assert.equal(element.querySelectorAll("li")[1].textContent?.trim(), "B")
            assert.equal(element.querySelectorAll("li")[2].textContent?.trim(), "C")

            element.todos.splice(1, 1)
            assert.equal(element.todos[0].title, "A")
            assert.equal(element.todos[1].title, "C")
            element.render()
            assert.equal(element.querySelectorAll("li")[0].textContent?.trim(), "A")
            assert.equal(element.querySelectorAll("li")[1].textContent?.trim(), "C")
        })
    })
})
