import './helpers'
import {assert} from 'chai'
import {ElementBuilder, FieldBuilder, FieldListenerData} from '../src/ceb'
import sinon from 'sinon'

describe('field.decorator', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should create field', () => {
        const tagName = 'el-default-field'

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            @FieldBuilder.field()
            altName = 'a field'
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(el.altName, 'a field')
        assert.strictEqual(el.getAttribute('alt-name'), 'a field')
    })
    it('should create boolean field', () => {
        const tagName = 'el-boolean-field'

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            @FieldBuilder.field({boolean: true})
            altName = true
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(el.altName, true)
        assert.strictEqual(el.getAttribute('alt-name'), '')
    })
    it('should override attribute name', () => {
        const tagName = 'el-attribute-field'

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            @FieldBuilder.field({attrName: 'an-attribute'})
            altName = 'a field'
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(el.altName, 'a field')
        assert.strictEqual(el.getAttribute('an-attribute'), 'a field')
    })
    it('should listen changes', () => {
        const tagName = 'el-listen-field'
        const listener = sinon.spy()

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            @FieldBuilder.field()
            altName = 'a field'

            @FieldBuilder.listen()
            onAltName(data: FieldListenerData) {
                listener(data)
            }
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(el.altName, 'a field')
        assert.strictEqual(el.getAttribute('alt-name'), 'a field')
        el.altName = 'new name'
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', 'new name')))
    })
    it('should listen changes with prefix', () => {
        const tagName = 'el-listen-field-with-prefix'
        const listener = sinon.spy()

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            @FieldBuilder.field()
            altName = 'a field'

            @FieldBuilder.listen({prefix: 'on_'})
            on_altName(data: FieldListenerData) {
                listener(data)
            }
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(el.altName, 'a field')
        assert.strictEqual(el.getAttribute('alt-name'), 'a field')
        el.altName = 'new name'
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', 'new name')))
    })
    it('should listen changes to an alternate attribute', () => {
        const tagName = 'el-listen-field-alternate-attribute'
        const listener = sinon.spy()

        @ElementBuilder.element<TestElement>({
            name: tagName
        })
        class TestElement extends HTMLElement {
            @FieldBuilder.field({attrName: 'an-attribute'})
            altName = 'a field'

            @FieldBuilder.listen()
            onAltName(data: FieldListenerData) {
                listener(data)
            }
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName))
        assert.ok(sandbox.querySelector(tagName))
        assert.strictEqual(el.altName, 'a field')
        assert.strictEqual(el.getAttribute('an-attribute'), 'a field')
        el.altName = 'new name'
        assert.ok(listener.called)
        assert.ok(listener.calledWithMatch(sinon.match.has('newVal', 'new name')))
    })
})
