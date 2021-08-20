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

describe("dom/BusBuilder", function () {
    let sandbox: HTMLDivElement
    const tagName = "messaging-dom-bus-builder"
    let testElement: TestElement
    let eventAListener: SinonSpy = sinon.spy()

    class TestElement extends HTMLElement {
        bus?: Bus
        busBis?: Bus
    }

    before(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
        ElementBuilder.get(TestElement).name(tagName).builder(
            DomBusBuilder.get().global(sandbox).subscribe(EventA, eventAListener),
            DomBusBuilder.get("busBis").global(sandbox),
        ).register()
        testElement = sandbox.appendChild(document.createElement(tagName))
    })

    it("should have a default bus property", function () {
        assert.property(testElement, "bus")
        assert.instanceOf(testElement.bus, DomBus)
    })

    it("should share the same bus instance", function () {
        assert.instanceOf(testElement.busBis, DomBus)
        assert.notStrictEqual(testElement.busBis, testElement.bus)
    })

    it("should listen to event", function (done) {
        const eventA = new EventA("test value")
        listen(sandbox, "event-a", 1, () => setTimeout(() => {
            assert.ok(eventAListener.calledOnce)
            assert.ok(eventAListener.calledWith(testElement, eventA))
            done()
        }, 0))
        sandbox.dispatchEvent(eventA)
    })

})
