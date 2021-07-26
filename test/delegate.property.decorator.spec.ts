import {assert} from 'chai'
import {ElementBuilder, PropertyDelegateBuilder} from '../src/ceb'

describe('delegate.property.decorator', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should delegate property', () => {
        const tagName = 'el-delegate-property'

        @ElementBuilder.element<TestElement>({name: tagName})
        class TestElement extends HTMLElement {
            @PropertyDelegateBuilder.delegate('input')
            value = 'default value'
            @PropertyDelegateBuilder.delegate('input', {isBoolean: true})
            disabled = true
            @PropertyDelegateBuilder.delegate('input', {toAttrName: 'type'})
            altType = 'text'
            @PropertyDelegateBuilder.delegate('button', {isShadow: true, toPropName: 'textContent'})
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
