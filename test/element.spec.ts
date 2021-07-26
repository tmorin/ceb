import './helpers'
import {assert} from 'chai'
import {ElementBuilder, utilities} from '../src/ceb'
import {getTagName} from './helpers'
import sinon, {SinonSpy} from 'sinon'


describe('element', () => {
    let sandbox

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })

    it('should create an element', () => {
        class ElBuilderShouldCreateElement extends HTMLElement {
            altName = 'my name'
        }

        ElementBuilder.get(ElBuilderShouldCreateElement).register()
        const tagName = getTagName(ElBuilderShouldCreateElement)
        const element = sandbox.appendChild(document.createElement(tagName)) as ElBuilderShouldCreateElement
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(element.altName, 'my name')
    })

    it('should create element with inline class', () => {
        interface IMyCustomElement extends HTMLElement {
            altName: string
        }

        const tagName = utilities.toKebabCase('MyCustomElement')
        ElementBuilder
            .get(class extends HTMLElement implements IMyCustomElement {
                public altName = 'my name'
            })
            .name(tagName)
            .register()
        const element: IMyCustomElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(element.altName, 'my name')
    })

    it('should create an element with a custom name', async () => {
        class ElBuilderShouldCreateElement extends HTMLElement {
            altName = 'my name'
        }

        ElementBuilder.get(ElBuilderShouldCreateElement).name('custom-name').register()
        const element = sandbox.appendChild(document.createElement('custom-name')) as ElBuilderShouldCreateElement
        assert.ok(sandbox.querySelector('custom-name'))
        assert.strictEqual(element.altName, 'my name')
    })

    it('should extend an element', () => {
        class ElBuilderShouldExtendedHtmlElement extends HTMLFormElement {
            altName = 'my name'
        }

        ElementBuilder.get(ElBuilderShouldExtendedHtmlElement).extends('form').register()
        const tagName = getTagName(ElBuilderShouldExtendedHtmlElement)
        const element = sandbox.appendChild(document.createElement('form', {is: tagName})) as ElBuilderShouldExtendedHtmlElement
        assert.ok(sandbox.querySelector('form'))
        assert.strictEqual(element.altName, 'my name')
    })

    it('should invoke hooks', () => {
        const connectedCallbackSpyBefore: SinonSpy = sinon.spy()
        const connectedCallbackSpy: SinonSpy = sinon.spy()
        const connectedCallbackSpyAfter: SinonSpy = sinon.spy()

        class ElBuilderShouldInvokeHooks extends HTMLElement {
        }

        ElementBuilder.get(ElBuilderShouldInvokeHooks)
            .before('connectedCallback', connectedCallbackSpyBefore)
            .on('connectedCallback', connectedCallbackSpy)
            .after('connectedCallback', connectedCallbackSpyAfter)
            .register()
        const tagName = getTagName(ElBuilderShouldInvokeHooks)
        sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(connectedCallbackSpyBefore.calledOnce, true)
        assert.strictEqual(connectedCallbackSpy.calledOnce, true)
        assert.strictEqual(connectedCallbackSpyAfter.calledOnce, true)
    })

})
