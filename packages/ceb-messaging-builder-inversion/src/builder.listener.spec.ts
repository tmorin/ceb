import {assert} from "chai";
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {Container, ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion-core";
import {BusInversionBuilder} from "./builder";
import {BusInversionBuilderModule} from "./module";
import {EventA, NotImplementedBus} from "./__TEST/fixtures";

describe("ceb-messaging-builder-inversion/builder/listener", function () {
    let sandbox: HTMLDivElement
    const tagName = "messaging-bus-inversion-builder-listener"
    let container: Container
    let bus: NotImplementedBus
    let testElement: TestElement

    class TestElement extends HTMLElement {
        bus?: Bus
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
        ElementBuilder.get(TestElement).name(tagName).builder(
            BusInversionBuilder.get().subscribe(EventA, () => {
            }),
        ).register()
        sandbox = document.body.appendChild(document.createElement('div'))
        testElement = sandbox.appendChild(document.createElement(tagName))
    })

    after(async function () {
        await container.dispose()
    })

    it("should subscribe", function () {
        assert.equal(bus.subscribeCalls.length, 1)
        assert.equal(bus.subscribeCalls[0][0], EventA)
    })

})
