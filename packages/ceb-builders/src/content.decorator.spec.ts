import {assert} from 'chai'
import {ElementBuilder} from "@tmorin/ceb-core";
import {ContentBuilder} from "./content";

describe('content.decorator', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should set shadow content', () => {
        const tagName = 'content-decorator'

        @ElementBuilder.get().name(tagName).decorate()
        @ContentBuilder.get('<p><input></p>').shadow().decorate()
        class TestElement extends HTMLElement {
        }

        const element = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.shadowRoot?.querySelector('input'))
    })
})
