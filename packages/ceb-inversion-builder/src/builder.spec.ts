import {assert} from "chai"
import {Container, ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion";
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {InversionBuilder} from "./builder";
import {InversionBuilderModule} from "./module";

class ServiceA {
    methodA() {
        return "resultA"
    }
}

class ServiceB {
    constructor(
        private readonly serviceA: ServiceA
    ) {
    }

    methodA() {
        return this.serviceA.methodA()
    }
}

describe("inversion/builder", function () {
    let sandbox: HTMLDivElement
    let container: Container

    describe("with InversionBuilderModule", function () {
        let testElement: TestElement
        const tagName = "inversion-builder-inversion-builder-module"

        class TestElement extends HTMLElement {
            serviceA?: ServiceA
            serviceB?: ServiceB
        }

        before(async () => {
            container = await ContainerBuilder.get()
                .module(new InversionBuilderModule())
                .module(OnlyConfigureModule.create(async function () {
                    this.registry.registerFactory<ServiceA>("ServiceA", () => new ServiceA())
                    this.registry.registerFactory<ServiceB>("ServiceB", (registry) => new ServiceB(registry.resolve<ServiceA>("ServiceA")))
                }))
                .build()
                .initialize()
            sandbox = document.body.appendChild(document.createElement('div'))
            ElementBuilder.get(TestElement).name(tagName).builder(
                InversionBuilder.get("serviceA").key("ServiceA"),
                InversionBuilder.get("serviceB").key("ServiceB"),
            ).register()
            testElement = sandbox.appendChild(document.createElement(tagName) as TestElement)

        })
        after(async () => {
            // @ts-ignore
            InversionBuilder.setDefaultContainer(undefined)
            container?.dispose()
        })
        it("should inject ServiceA", function () {
            assert.property(testElement, "serviceA")
            assert.strictEqual(testElement.serviceA?.methodA(), "resultA")
        })
        it("should inject ServiceB", function () {
            assert.property(testElement, "serviceB")
            assert.strictEqual(testElement.serviceB?.methodA(), "resultA")
        })
    })

    describe("with a container provider", function () {
        let testElement: TestElement
        const tagName = "inversion-builder-container-provider"

        class TestElement extends HTMLElement {
            serviceA?: ServiceA
            serviceB?: ServiceB
        }

        before(async () => {
            container = await ContainerBuilder.get()
                .module(OnlyConfigureModule.create(async function () {
                    this.registry.registerFactory<ServiceA>("ServiceA", () => new ServiceA())
                    this.registry.registerFactory<ServiceB>("ServiceB", (registry) => new ServiceB(registry.resolve<ServiceA>("ServiceA")))
                }))
                .build()
                .initialize()
            sandbox = document.body.appendChild(document.createElement('div'))
            ElementBuilder.get(TestElement).name(tagName).builder(
                InversionBuilder.get("serviceA").key("ServiceA").provider(() => container),
                InversionBuilder.get("serviceB").key("ServiceB").provider(() => container),
            ).register()
            testElement = sandbox.appendChild(document.createElement(tagName) as TestElement)

        })
        after(async () => {
            // @ts-ignore
            InversionBuilder.setDefaultContainer(undefined)
            container?.dispose()
        })
        it("should inject ServiceA", function () {
            assert.property(testElement, "serviceA")
            assert.strictEqual(testElement.serviceA?.methodA(), "resultA")
        })
        it("should inject ServiceB", function () {
            assert.property(testElement, "serviceB")
            assert.strictEqual(testElement.serviceB?.methodA(), "resultA")
        })
    })
})
