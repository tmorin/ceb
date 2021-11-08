import {assert} from "chai";
import {ElementBuilder} from "@tmorin/ceb-core";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {Container, ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion";
import {BusInversionBuilder} from "./builder";
import {BusInversionBuilderModule} from "./module";
import {NotImplementedBus} from "./__TEST/fixtures";

describe("messaging/bus/inversion/builder", function () {
    let container: Container
    let sandbox: HTMLDivElement
    let bus: NotImplementedBus

    describe("when container provided by module", function () {
        const tagName = "messaging-bus-inversion-builder-module"
        let testElement: TestElementA

        class TestElementA extends HTMLElement {
            bus?: Bus
            busBis?: Bus
            busAlternative?: Bus
        }

        before(async function () {
            bus = new NotImplementedBus()

            container = await ContainerBuilder.get()
                .module(OnlyConfigureModule.create(async function () {
                    this.registry.registerValue(BusSymbol, bus)
                    this.registry.registerValue("busAlternative", bus)
                }))
                .module(new BusInversionBuilderModule())
                .build()
                .initialize()
            ElementBuilder.get(TestElementA).name(tagName).builder(
                BusInversionBuilder.get(),
                BusInversionBuilder.get("busBis"),
                BusInversionBuilder.get("busAlternative").key("busAlternative"),
            ).register()
            sandbox = document.body.appendChild(document.createElement('div'))
            testElement = sandbox.appendChild(document.createElement(tagName))
        })
        after(async function () {
            await container.dispose()
        })
        it("should resolve container with default settings", function () {
            assert.property(testElement, "bus")
            assert.equal<any>(testElement.bus, bus)
        })
        it("should resolve container with custom property name", function () {
            assert.property(testElement, "busBis")
            assert.equal<any>(testElement.busBis, bus)
        })
        it("should resolve container with custom registry key", function () {
            assert.property(testElement, "busAlternative")
            assert.equal<any>(testElement.busAlternative, bus)
        })
    })

    describe("when container provided by provider", function () {
        const tagName = "messaging-bus-inversion-builder-provider"
        let testElement: TestElementB
        let sandbox: HTMLDivElement

        class TestElementB extends HTMLElement {
            bus?: Bus
            busBis?: Bus
            busAlternative?: Bus
        }

        before(async function () {
            container = await ContainerBuilder.get()
                .module(OnlyConfigureModule.create(async function () {
                    this.registry.registerValue(BusSymbol, bus)
                    this.registry.registerValue("busAlternative", bus)
                }))
                .build()
                .initialize()
            ElementBuilder.get(TestElementB).name(tagName).builder(
                BusInversionBuilder.get().provider(() => container),
                BusInversionBuilder.get("busBis").provider(() => container),
                BusInversionBuilder.get("busAlternative").key("busAlternative").provider(() => container),
            ).register()
            sandbox = document.body.appendChild(document.createElement('div'))
            testElement = sandbox.appendChild(document.createElement(tagName))
        })
        after(async function () {
            await container.dispose()
        })
        it("should resolve container with default settings", function () {
            assert.property(testElement, "bus")
            assert.equal<any>(testElement.bus, bus)
        })
        it("should resolve container with custom property name", function () {
            assert.property(testElement, "busBis")
            assert.equal<any>(testElement.busBis, bus)
        })
        it("should resolve container with custom registry key", function () {
            assert.property(testElement, "busAlternative")
            assert.equal<any>(testElement.busAlternative, bus)
        })
    })
})
