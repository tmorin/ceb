import {assert} from 'chai'
import {ElementBuilder, PropertyDelegationBuilder} from '../src'

describe('delegate.property.decorator', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should delegate property', () => {
        const tagName = 'delegate-property-decorator'

        @ElementBuilder.get().name(tagName).decorate()
        class TestElement extends HTMLElement {
            @PropertyDelegationBuilder.get().to("input").decorate()
            value = 'default value'
            @PropertyDelegationBuilder.get().to("input").boolean().decorate()
            disabled = true
            @PropertyDelegationBuilder.get().to("input").attribute("type").decorate()
            altType = 'text'
            @PropertyDelegationBuilder.get().to("button").shadow().property('textContent').decorate()
            label = 'default label'

            constructor() {
                super()
                this.attachShadow({mode: 'open'})
                this.shadowRoot.innerHTML = `<slot></slot><button></button>`
            }

            connectedCallback() {
                this.innerHTML = `<input/>`
            }
        }

        const element: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))

        assert.strictEqual(element.value, 'default value')
        assert.strictEqual(element.querySelector('input').value, 'default value')

        assert.strictEqual(element.disabled, true)
        assert.strictEqual(element.querySelector('input').disabled, true)

        assert.strictEqual(element.altType, 'text')
        assert.strictEqual(element.querySelector('input').getAttribute('type'), 'text')

        assert.strictEqual(element.label, 'default label')
        assert.strictEqual(element.shadowRoot.querySelector('button').textContent, 'default label')
    })
})
