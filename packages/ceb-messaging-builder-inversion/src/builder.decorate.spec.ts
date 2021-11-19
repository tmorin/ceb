import {assert} from "chai";
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {Container, ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion-core";
import {BusInversionBuilder} from "./builder";
import {BusInversionBuilderModule} from "./module";
import {EventA, NotImplementedBus} from "./__TEST/fixtures";

describe("ceb-messaging-builder-inversion/builder/decorate", function () {
    let sandbox: HTMLDivElement
    const tagName = "messaging-bus-inversion-builder-decorate"
    let container: Container
    let bus: NotImplementedBus
    let testElement: TestElement

    @ElementBuilder.get(TestElement).name(tagName).decorate()
    class TestElement extends HTMLElement {
        @BusInversionBuilder.get().decorate()
        bus?: Bus

        @BusInversionBuilder.get().subscribe().decorate()
        onEventA(event: EventA) {
        }

        @BusInversionBuilder.get().subscribe().type(EventA).decorate()
        onEventABis(event: EventA) {
        }
    }

    before(async function () {
        bus = new NotImplementedBus()
        container = await ContainerBuilder.get()
            .module(OnlyConfigureModule.create(async function () {
                this.registry.registerValue(BusSymbol, bus)
            }))
            .module(new BusInversionBuilderModule())
            .build()
            .initialize()
        sandbox = document.body.appendChild(document.createElement('div'))
        testElement = sandbox.appendChild(document.createElement(tagName) as TestElement)
    })

    after(async function () {
        await container.dispose()
    })

    it("should resolve container with default settings", function () {
        assert.property(testElement, "bus")
        assert.equal<any>(testElement.bus, bus)
    })

    it("should subscribe", function () {
        assert.equal(bus.subscribeCalls.length, 2)
        assert.equal(bus.subscribeCalls[0][0], "EventA")
        assert.equal(bus.subscribeCalls[1][0], EventA)
    })

})
