import {assert} from "chai"
import sinon, {SinonSpy} from "sinon";
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {listen} from "@tmorin/ceb-elements-testing";
import {Bus} from "@tmorin/ceb-messaging-core";
import {DomBusBuilder} from "./builder";
import {DomBus} from "./bus";
import {EventA} from "./__TEST/fixture";
import {DomMessage} from "./message";

describe("ceb-messaging-dom/builder", function () {
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
            DomBusBuilder.get().global(sandbox).subscribe(EventA.name, eventAListener),
            DomBusBuilder.get("busBis").global(sandbox),
        ).register()
        testElement = sandbox.appendChild(document.createElement(tagName))
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
        testElement?.parentElement?.removeChild(testElement)
        sandbox.appendChild(testElement)
        listen(sandbox, DomMessage.toName(EventA), 1, () => setTimeout(() => {
            assert.ok(eventAListener.calledOnce)
            assert.ok(eventAListener.calledWith(testElement, eventA))
            done()
        }, 0))
        sandbox.dispatchEvent(eventA)
    })

})
