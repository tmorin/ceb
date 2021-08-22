import {assert} from 'chai'
import {ElementBuilder} from "@tmorin/ceb-core";
import {ContentBuilder} from "./content";

describe('content', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should set HTML content', () => {
        const tagName = "content-set-string";

        class TestElement extends HTMLElement {
        }

        ElementBuilder.get(TestElement).name(tagName).builder(
            ContentBuilder.get(`<p><input></p>`)
        ).register()
        const element: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('input'))
    })

    it('should set HTML content by function', () => {
        const tagName = "content-set-function";

        class TestElement extends HTMLElement {
            name = "World"
        }

        ElementBuilder.get(TestElement).name(tagName).builder(
            ContentBuilder.get<TestElement>((el) => `<p>${el.name}</p>`)
        ).register()
        const element = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.querySelector('p'))
    })

    it('should set shadow content', () => {
        const tagName = "content-shadow";

        class TestElement extends HTMLElement {
        }

        ElementBuilder.get(TestElement).name(tagName).builder(
            ContentBuilder.get(`<p><input></p>`).shadow()
        ).register()
        const element: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.shadowRoot?.querySelector('input'))
    })

})
