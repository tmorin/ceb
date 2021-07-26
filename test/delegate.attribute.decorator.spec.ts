import {assert} from 'chai'
import {AttributeDelegateBuilder, ElementBuilder} from '../src/ceb'

describe('delegate.attribute.decorator', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should delegate attribute', () => {
        const tagName = 'el-delegate-attribute'

        @ElementBuilder.element<TestElement>({name: tagName})
        @AttributeDelegateBuilder.delegate('value', 'input', {
            defaultValue: 'default value'
        })
        @AttributeDelegateBuilder.delegate('disabled', 'input', {
            isBoolean: true,
            defaultValue: true
        })
        @AttributeDelegateBuilder.delegate('alt-type', 'input', {
            toAttrName: 'type',
            defaultValue: 'text'
        })
        @AttributeDelegateBuilder.delegate('label', 'button', {
            isShadow: true,
            toPropName: 'textContent',
            defaultValue: 'default label'
        })
        class TestElement extends HTMLElement {
            constructor() {
                super()
                this.attachShadow({mode: 'open'})
                this.shadowRoot.innerHTML = `<slot></slot><button></button>`
            }

            connectedCallback() {
                this.innerHTML = `<input/>`
            }
        }

        const element = sandbox.appendChild(document.createElement(tagName)) as TestElement
        assert.ok(sandbox.querySelector(tagName))

        assert.strictEqual(element.getAttribute('value'), 'default value')
        assert.strictEqual(element.querySelector('input').getAttribute('value'), 'default value')

        assert.strictEqual(element.hasAttribute('disabled'), true)
        assert.strictEqual(element.querySelector('input').hasAttribute('disabled'), true)

        assert.strictEqual(element.getAttribute('alt-type'), 'text')
        assert.strictEqual(element.querySelector('input').getAttribute('type'), 'text')

        assert.strictEqual(element.getAttribute('label'), 'default label')
        assert.strictEqual(element.shadowRoot.querySelector('button').textContent, 'default label')
    })
})
