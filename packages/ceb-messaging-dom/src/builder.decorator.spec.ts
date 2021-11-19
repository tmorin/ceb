import {assert} from "chai"
import sinon, {SinonSpy} from "sinon";
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {listen} from "@tmorin/ceb-elements-testing";
import {Bus} from "@tmorin/ceb-messaging-core";
import {DomBusBuilder} from "./builder";
import {DomBus} from "./bus";
import {EventB} from "./__TEST/fixture";
import {DomMessage} from "./message";

describe("ceb-messaging-dom/builder/decorator", function () {
    let sandbox: HTMLDivElement
    const tagName = "messaging-dom-bus-builder-decorator"
    let testElement: TestElement
    let eventBListener: SinonSpy = sinon.spy()
    let eventBListenerBis: SinonSpy = sinon.spy()

    @ElementBuilder.get(TestElement).name(tagName).decorate()
    class TestElement extends HTMLElement {
        @DomBusBuilder.get().decorate()
        bus?: Bus
        @DomBusBuilder.get().decorate()
        busBis?: Bus

        @DomBusBuilder.get().subscribe().decorate()
        onEventB(event: EventB) {
            eventBListener(event)
        }

        @DomBusBuilder.get().subscribe().type(DomMessage.toName(EventB)).decorate()
        onEventBBis(event: EventB) {
            eventBListenerBis(event)
        }
    }

    before(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
        testElement = sandbox.appendChild(document.createElement(tagName) as TestElement)
    })

    it("should have a default bus property", function () {
        assert.property(testElement, "bus")
        assert.instanceOf(testElement.bus, DomBus)
    })

    it("should not share the same bus instance", function () {
        assert.instanceOf(testElement.busBis, DomBus)
        assert.notStrictEqual(testElement.busBis, testElement.bus)
    })

    it("should listen to event", function (done) {
        const eventB = new EventB("test value")
        listen(window, DomMessage.toName(EventB), 1, () => setTimeout(() => {
            assert.ok(eventBListener.calledOnce)
            assert.ok(eventBListener.calledWith(eventB))
            assert.ok(eventBListenerBis.calledOnce)
            assert.ok(eventBListenerBis.calledWith(eventB))
            done()
        }, 0))
        window.dispatchEvent(eventB)
    })

})
