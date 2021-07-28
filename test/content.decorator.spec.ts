import {assert} from 'chai'
import {ContentBuilder, ElementBuilder} from '../src'

describe('content.decorator', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should set shadow content', () => {
        const tagName = 'content-decorator'

        @ElementBuilder.get().name(tagName).decorate()
        @ContentBuilder.get('<p><input></p>').shadow().decorate()
        class TestElement extends HTMLElement {
        }

        const element: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(element.shadowRoot.querySelector('input'))
    })
})
