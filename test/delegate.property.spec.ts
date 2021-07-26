import {assert} from 'chai'
import {ElementBuilder, PropertyDelegateBuilder} from '../src'
import {getTagName} from './helpers'

describe('delegate.property', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should delegate property', () => {
        class ElBuilderShouldDelegateProp extends HTMLElement {
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

        ElementBuilder.get(ElBuilderShouldDelegateProp).builder(
            PropertyDelegateBuilder.get('value')
                .to('input'),
            PropertyDelegateBuilder.get('disabled')
                .to('input').boolean(),
            PropertyDelegateBuilder.get('altType')
                .to('input').attribute('type'),
            PropertyDelegateBuilder.get('label')
                .to('button').shadow().property('textContent'),
        ).register()
        const tagName = getTagName(ElBuilderShouldDelegateProp)
        const element: ElBuilderShouldDelegateProp = sandbox.appendChild(document.createElement(tagName))
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
