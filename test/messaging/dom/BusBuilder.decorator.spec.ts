import {Bus, DomBus, DomBusBuilder, DomEvent} from "../../../src/messaging";
import {ElementBuilder} from "../../../src";
import {assert} from "chai"
import sinon, {SinonSpy} from "sinon";
import {listen} from "../../helpers";

class EventA extends DomEvent<string> {
    constructor(body: string) {
        super(EventA, body);
    }
}

describe("messaging/dom/builder/decorator", function () {
    let sandbox: HTMLDivElement
    const tagName = "messaging-dom-bus-builder-decorator"
    let testElement: TestElement
    let eventAListener: SinonSpy = sinon.spy()
    let eventAListenerBis: SinonSpy = sinon.spy()

    @ElementBuilder.get(TestElement).name(tagName).decorate()
    class TestElement extends HTMLElement {
        @DomBusBuilder.get().decorate()
        bus?: Bus
        @DomBusBuilder.get().decorate()
        busBis?: Bus

        @DomBusBuilder.get().subscribe().decorate()
        onEventA(event: EventA) {
            eventAListener(event)
        }

        @DomBusBuilder.get().subscribe().type(EventA).decorate()
        onEventABis(event: EventA) {
            eventAListenerBis(event)
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
        const eventA = new EventA("test value")
        listen(window, "event-a", 1, () => setTimeout(() => {
            assert.ok(eventAListener.calledOnce)
            assert.ok(eventAListener.calledWith(eventA))
            assert.ok(eventAListenerBis.calledOnce)
            assert.ok(eventAListenerBis.calledWith(eventA))
            done()
        }, 0))
        window.dispatchEvent(eventA)
    })

})
