import './helpers'
import sinon, {SinonSpy} from 'sinon'
import {assert} from 'chai'
import {ElementBuilder} from '../src'
import {OnBuilder} from '../src/on'

function listen(el: Node, type: string, limit: number, done: Function) {
    let counter = 0
    const listener = () => {
        counter++
        if (counter === limit) {
            done()
            el.removeEventListener(type, listener)
        }
    }
    el.addEventListener(type, listener)
}

describe('on.decorator', () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    context('listen events', () => {
        const tagName = 'el-listen-events'
        let bubblingListener: SinonSpy, el: HTMLElement
        beforeEach(done => {
            bubblingListener = sinon.spy()

            @ElementBuilder.element<TestElement>({name: tagName})
            class TestElement extends HTMLElement {
                @OnBuilder.listen('custom-event')
                onCustomEvent(data: Event) {
                    bubblingListener(data)
                }

                connectedCallback() {
                    this.innerHTML = `<input/>`
                }
            }

            el = sandbox.appendChild(document.createElement(tagName))
            listen(sandbox, 'custom-event', 1, done)
            el.querySelector('input').dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
        })
        it('should invoke the bubbling and capture listeners', () => {
            assert.ok(bubblingListener.calledOnce)
            assert.ok(bubblingListener.calledWith(sinon.match.instanceOf(CustomEvent)))
        })
    })
})
