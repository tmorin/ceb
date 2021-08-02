import './helpers'
import {assert} from 'chai'
import {AttributeBuilder, AttributeListenerData, ElementBuilder} from '../src'
import sinon from 'sinon'

describe('attribute.decorator', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should listen changes with default value', function () {
        const tagName = 'el-default-values'
        const listener = sinon.spy()

        @ElementBuilder.get().name(tagName).decorate()
        class TestElement extends HTMLElement {
            @AttributeBuilder.get().decorate()
            onAnAttribute(data: AttributeListenerData) {
                listener(data)
            }
        }

        const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        el.setAttribute('an-attribute', 'new name')
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', 'new name')))
    })
    it('should listen boolean changes', function () {
        const tagName = 'el-boolean-values'
        const listener = sinon.spy()

        @ElementBuilder.get<TestElement>().name(tagName).decorate()
        class TestElement extends HTMLElement {
            @AttributeBuilder.get().boolean().decorate()
            onAnAttribute(data: AttributeListenerData) {
                listener(data)
            }
        }

        const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        el.setAttribute('an-attribute', '')
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', true)))
        listener.resetHistory()
        el.removeAttribute('an-attribute')
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', false)))
    })
    it('should listen changes with default prefix', function () {
        const tagName = 'el-with-default-prefix'
        const listener = sinon.spy()

        @ElementBuilder.get<TestElement>().name(tagName).decorate()
        class TestElement extends HTMLElement {
            @AttributeBuilder.get().decorate()
            onAnAttribute(data: AttributeListenerData) {
                listener(data)
            }
        }

        const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        el.setAttribute('an-attribute', 'new name')
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', 'new name')))
    })
    it('should listen changes with custom prefix', function () {
        const tagName = 'el-with-custom-prefix'
        const listener = sinon.spy()

        @ElementBuilder.get<TestElement>().name(tagName).decorate()
        class TestElement extends HTMLElement {
            @AttributeBuilder.get().decorate('on_')
            on_anAttribute(data: AttributeListenerData) {
                listener(data)
            }
        }

        const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        el.setAttribute('an-attribute', 'new name')
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', 'new name')))
    })
    it('should listen changes with no prefix', function () {
        const tagName = 'el-with-no-prefix'
        const listener = sinon.spy()

        @ElementBuilder.get<TestElement>().name(tagName).decorate()
        class TestElement extends HTMLElement {
            @AttributeBuilder.get().decorate("")
            anAttribute(data: AttributeListenerData) {
                listener(data)
            }
        }

        const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))
        el.setAttribute('an-attribute', 'new name')
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', 'new name')))
    })
})
