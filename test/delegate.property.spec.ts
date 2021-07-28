import {assert} from 'chai'
import {ElementBuilder, PropertyDelegationBuilder} from '../src'

describe('delegate.property', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should delegate property', () => {
        const tagName = 'delegate-property'

        class TestElement extends HTMLElement {
            value = 'default value'
            disabled = true
            altType = 'text'
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

        ElementBuilder.get(TestElement).name(tagName).builder(
            PropertyDelegationBuilder.get('value')
                .to('input'),
            PropertyDelegationBuilder.get('disabled')
                .to('input').boolean(),
            PropertyDelegationBuilder.get('altType')
                .to('input').attribute('type'),
            PropertyDelegationBuilder.get('label')
                .to('button').shadow().property('textContent'),
        ).register()

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
