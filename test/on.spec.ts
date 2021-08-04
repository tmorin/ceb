import './helpers'
import sinon, {SinonSpy} from 'sinon'
import {assert} from 'chai'
import {ElementBuilder, OnBuilder} from '../src'
import {getTagName, listen} from './helpers'

describe('on', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    context('listen events', () => {
        let bubblingListener: SinonSpy, captureListener: SinonSpy, el: HTMLElement
        beforeEach(done => {
            bubblingListener = sinon.spy()
            captureListener = sinon.spy()

            class OnBuilderListenEvents extends HTMLElement {
            }

            ElementBuilder.get(OnBuilderListenEvents)
                .on('connectedCallback', el => el.innerHTML = '<input>')
                .builder(
                    OnBuilder.get('custom-event').invoke(bubblingListener),
                    OnBuilder.get('custom-event').invoke(captureListener).capture()
                )
                .register()
            const tagName = getTagName(OnBuilderListenEvents)
            el = sandbox.appendChild(document.createElement(tagName))
            listen(sandbox, 'custom-event', 1, done)
            el.querySelector('input')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
        })
        it('should invoke the bubbling and capture listeners', () => {
            assert.ok(bubblingListener.calledOnce)
            assert.ok(bubblingListener.calledWith(el, sinon.match(Object)))
            assert.ok(captureListener.calledOnce)
            assert.ok(captureListener.calledWith(el, sinon.match(Object)))
        })
    })

    context('listen events on target', () => {
        let bubblingListener: SinonSpy, captureListener: SinonSpy, el: HTMLElement
        beforeEach(done => {
            bubblingListener = sinon.spy()
            captureListener = sinon.spy()

            class OnBuilderListenEventsOnTarget extends HTMLElement {
            }

            ElementBuilder.get(OnBuilderListenEventsOnTarget)
                .before('connectedCallback', el => el.innerHTML = '<input>')
                .builder(
                    OnBuilder.get('custom-event input').invoke(bubblingListener),
                    OnBuilder.get('custom-event input').invoke(captureListener).capture()
                )
                .register()
            const tagName = getTagName(OnBuilderListenEventsOnTarget)
            el = sandbox.appendChild(document.createElement(tagName))
            listen(sandbox, 'custom-event', 1, done)
            el.querySelector('input')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
        })
        it('should invoke the bubbling and capture listeners on target', () => {
            assert.ok(bubblingListener.calledOnce)
            assert.ok(bubblingListener.calledWith(el, sinon.match(Object)))
            assert.ok(captureListener.calledOnce)
            assert.ok(captureListener.calledWith(el, sinon.match(Object)))
        })
    })

    context('listen events on delegated elements', () => {
        let fn: SinonSpy, fnI1: SinonSpy, fnI: SinonSpy, el: HTMLElement
        beforeEach(done => {
            fn = sinon.spy().named('fn')
            fnI1 = sinon.spy().named('fnI1')
            fnI = sinon.spy().named('fnI')

            class OnBuilderListenEventsByDelegation extends HTMLElement {
            }

            ElementBuilder.get(OnBuilderListenEventsByDelegation)
                .before('connectedCallback',
                    el => el.innerHTML = '<i class="i1"><b>i1</b></i><i class="i2"><b>i2</b></i>'
                )
                .builder(
                    OnBuilder.get('custom-event').invoke(fn),
                    OnBuilder.get('custom-event').delegate('.i1').invoke(fnI1),
                    OnBuilder.get('custom-event').delegate('i').invoke(fnI),
                )
                .register()
            const tagName = getTagName(OnBuilderListenEventsByDelegation)
            el = sandbox.appendChild(document.createElement(tagName))
            listen(sandbox, 'custom-event', 3, done)
            el.querySelector('.i1')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
            el.querySelector('.i2')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
            el.querySelector('.i1 b')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
        })
        it('should invoke listeners', () => {
            assert.ok(fn.calledThrice)
            assert.ok(fnI.calledThrice)
            assert.ok(fnI1.calledTwice)
            assert.ok(fnI1.calledWith(el, sinon.match(Object), el.querySelector('.i1')))
            assert.ok(fnI1.calledWith(el, sinon.match(Object), el.querySelector('.i1')))
            assert.strictEqual(fnI1.getCall(0).args[1].target, el.querySelector('.i1'))
            assert.strictEqual(fnI.getCall(1).args[1].target, el.querySelector('.i2'))
        })
    })

    context('listen events on delegated elements with shadow', () => {
        let fn: SinonSpy, fnI1: SinonSpy, fnI: SinonSpy, el: HTMLElement
        beforeEach(done => {
            fn = sinon.spy().named('fn')
            fnI1 = sinon.spy().named('fnI1')
            fnI = sinon.spy().named('fnI')

            class OnBuilderListenEventsByDelegationWithShadow extends HTMLElement {
                constructor() {
                    super()
                    this.attachShadow({mode: 'open'}).innerHTML = '<i class="i1"><b>i1</b></i><i class="i2"><b>i2</b></i>'
                }
            }

            ElementBuilder.get(OnBuilderListenEventsByDelegationWithShadow)
                .builder(
                    OnBuilder.get('custom-event').shadow().invoke(fn),
                    OnBuilder.get('custom-event').shadow().delegate('.i1').invoke(fnI1),
                    OnBuilder.get('custom-event').shadow().delegate('i').invoke(fnI),
                )
                .register()
            const tagName = getTagName(OnBuilderListenEventsByDelegationWithShadow)
            el = sandbox.appendChild(document.createElement(tagName))
            el.shadowRoot && listen(el.shadowRoot, 'custom-event', 3, done)
            el.shadowRoot?.querySelector('.i1')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
            el.shadowRoot?.querySelector('.i2')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
            el.shadowRoot?.querySelector('.i1 b')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
        })
        it('should invoke listeners', () => {
            assert.ok(fn.calledThrice)
            assert.ok(fnI.calledThrice)
            assert.ok(fnI1.calledTwice)
            assert.ok(fnI1.calledWith(el, sinon.match(Object), el.shadowRoot?.querySelector('.i1')))
            assert.ok(fnI1.calledWith(el, sinon.match(Object), el.shadowRoot?.querySelector('.i1')))
        })
    })

    context('skip propagation and default behavior', () => {
        let wrapperListener: SinonSpy, elListener: SinonSpy, wrapper, el: HTMLElement
        beforeEach(done => {
            wrapperListener = sinon.spy()
            elListener = sinon.spy()

            class OnBuilderSkipPropagationAndDefault extends HTMLElement {
            }

            ElementBuilder.get(OnBuilderSkipPropagationAndDefault)
                .before('connectedCallback',
                    el => el.innerHTML = '<button>button</button>'
                )
                .builder(
                    OnBuilder.get('custom-event').skip().invoke(elListener)
                )
                .register()
            const tagName = getTagName(OnBuilderSkipPropagationAndDefault)

            wrapper = document.createElement('div')
            el = wrapper.appendChild(document.createElement(tagName))
            sandbox.appendChild(wrapper)

            wrapper.addEventListener('custom-event', wrapperListener)

            setTimeout(() => {
                listen(el, 'custom-event', 1, done)
                el.querySelector('button')?.dispatchEvent(new CustomEvent('custom-event', {bubbles: true}))
            }, 10)
        })
        it('should invoke listeners', () => {
            assert.ok(elListener.calledOnce)
            assert.ok(wrapperListener.notCalled)
        })
    })
})
