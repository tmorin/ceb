import {assert} from 'chai'
import sinon, {SinonSpy} from 'sinon'
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {AttributeBuilder} from "./attribute";
import {getTagName} from "@tmorin/ceb-elements-testing";

describe('attribute', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should manage string and boolean values', () => {
        class ShouldManageStringBooleanValues extends HTMLElement {
        }

        ElementBuilder.get(ShouldManageStringBooleanValues).builder(
            AttributeBuilder.get('alt-string').default('a default value'),
            AttributeBuilder.get('alt-string-bis'),
            AttributeBuilder.get('alt-boolean').boolean().default(true),
            AttributeBuilder.get('alt-boolean-bis').boolean()
        ).register()
        const tagName = getTagName(ShouldManageStringBooleanValues)
        const el = sandbox.appendChild(document.createElement(tagName) as ShouldManageStringBooleanValues)
        assert.ok(sandbox.querySelector(tagName))

        assert.strictEqual(el.getAttribute('alt-string'), 'a default value')
        assert.strictEqual(el.getAttribute('alt-string-bis'), null)
        assert.strictEqual(el.hasAttribute('alt-boolean'), true)
        assert.strictEqual(el.hasAttribute('alt-boolean-bis'), false)

        el.setAttribute('alt-string', 'a new value')
        assert.strictEqual(el.getAttribute('alt-string'), 'a new value')
        sandbox.removeChild(el)
        sandbox.appendChild(el)
        assert.strictEqual(el.getAttribute('alt-string'), 'a new value')
    })

    it('should listen to values', () => {
        const spy1: SinonSpy = sinon.spy()
        const spy2: SinonSpy = sinon.spy()
        const spy3: SinonSpy = sinon.spy()
        const spy4: SinonSpy = sinon.spy()

        class ShouldListenToValues extends HTMLElement {
        }

        ElementBuilder.get(ShouldListenToValues).builder(
            AttributeBuilder.get('alt-string').default('a default value').listener(spy1),
            AttributeBuilder.get('alt-string-bis').listener(spy2),
            AttributeBuilder.get('alt-boolean').boolean().default(true).listener(spy3),
            AttributeBuilder.get('alt-boolean-bis').boolean().listener(spy4)
        ).register()
        const tagName = getTagName(ShouldListenToValues)
        const el: ShouldListenToValues = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        // initialization
        assert.ok(spy1.calledOnce)
        assert.ok(spy2.notCalled)
        assert.ok(spy3.calledOnce)
        assert.ok(spy4.notCalled)
        // mutation
        spy1.resetHistory()
        el.setAttribute('alt-string', 'a default value')
        assert.ok(spy1.notCalled)
        spy2.resetHistory()
        el.setAttribute('alt-string-bis', 'a new value')
        assert.ok(spy2.calledOnce)
        spy3.resetHistory()
        el.setAttribute('alt-boolean', '')
        assert.ok(spy3.notCalled)
        spy4.resetHistory()
        el.setAttribute('alt-boolean-bis', '')
        assert.ok(spy4.calledOnce)
    })


    it('should get default value from HTML', () => {
        class AttributeShouldGetDefaultFromHtml extends HTMLElement {
        }

        ElementBuilder.get(AttributeShouldGetDefaultFromHtml).builder(
            AttributeBuilder.get('alt-string').default('a default value'),
            AttributeBuilder.get('alt-string-bis'),
            AttributeBuilder.get('alt-boolean').boolean()
        ).register()
        const tagName = getTagName(AttributeShouldGetDefaultFromHtml)
        sandbox.innerHTML = '<attribute-should-get-default-from-html alt-string="a new string" alt-string-bis="a new bis string" alt-boolean=""/>'
        const el = sandbox.querySelector(tagName) as AttributeShouldGetDefaultFromHtml
        assert.ok(el)

        assert.strictEqual(el.getAttribute('alt-string'), 'a new string')
        assert.strictEqual(el.getAttribute('alt-string-bis'), 'a new bis string')
        assert.strictEqual(el.hasAttribute('alt-boolean'), true)
    })
})
