import {assert} from "chai"
import sinon, {SinonSpy} from "sinon";
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {Bus} from "@tmorin/ceb-messaging-core";
import {AbstractSimpleEvent, InMemorySimpleBus} from "@tmorin/ceb-messaging-simple";
import {SimpleBusBuilder} from "./builder";

class EventA extends AbstractSimpleEvent<string> {
    constructor(body: string) {
        super(body);
    }
}

describe("ceb-messaging-simple-builder/builder", function () {
    let sandbox: HTMLDivElement
    const tagName = "messaging-simple-bus-builder"
    let testElement: TestElement
    let eventAListener: SinonSpy = sinon.spy()

    class TestElement extends HTMLElement {
        bus?: Bus
        busBis?: Bus
    }

    before(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
        ElementBuilder.get(TestElement).name(tagName).builder(
            SimpleBusBuilder.get().subscribe(EventA.name, eventAListener),
            SimpleBusBuilder.get("busBis"),
        ).register()
        testElement = sandbox.appendChild(document.createElement(tagName))
    })

    it("should have a default bus property", function () {
        assert.property(testElement, "bus")
        assert.instanceOf(testElement.bus, InMemorySimpleBus)
    })

    it("should share the same bus instance", function () {
        assert.instanceOf(testElement.busBis, InMemorySimpleBus)
        assert.strictEqual(testElement.busBis, testElement.bus)
    })

    it("should listen to event", async function () {
        const eventA = new EventA("test value")

        await InMemorySimpleBus.GLOBAL.publish(eventA)
        assert.ok(eventAListener.calledOnce)
        assert.ok(eventAListener.calledWith(testElement, eventA))

        testElement?.parentElement?.removeChild(testElement)
        await InMemorySimpleBus.GLOBAL.publish(eventA)
        assert.ok(eventAListener.calledOnce)
        assert.ok(eventAListener.calledWith(testElement, eventA))

        sandbox.appendChild(testElement)
        await InMemorySimpleBus.GLOBAL.publish(eventA)
        assert.ok(eventAListener.calledTwice)
        assert.ok(eventAListener.calledWith(testElement, eventA))
    })

})
