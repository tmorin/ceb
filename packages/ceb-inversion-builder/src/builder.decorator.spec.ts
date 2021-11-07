import {assert} from "chai"
import {Container, ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion";
import {ElementBuilder} from "@tmorin/ceb-core";
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

describe("inversion/builder/decorator", function () {
    let sandbox: HTMLDivElement
    let container: Container
    let testElement: TestElement
    const tagName = "inversion-builder-decorator"

    @ElementBuilder.get(TestElement).name(tagName).decorate()
    class TestElement extends HTMLElement {
        @InversionBuilder.get().decorate()
        serviceA?: ServiceA
        @InversionBuilder.get().decorate()
        serviceB?: ServiceB
        @InversionBuilder.get().key("serviceB").decorate()
        serviceBbis?: ServiceB
        @InversionBuilder.get().key(Symbol.for("serviceBWithSymbol")).decorate()
        serviceBWithSymbol?: ServiceB
    }

    before(async () => {
        container = await ContainerBuilder.get()
            .module(new InversionBuilderModule())
            .module(OnlyConfigureModule.create(async function () {
                this.registry.registerFactory<ServiceA>("serviceA", () => new ServiceA())
                this.registry.registerFactory<ServiceB>("serviceB", (registry) => new ServiceB(registry.resolve<ServiceA>("serviceA")))
                this.registry.registerFactory<ServiceB>(Symbol.for("serviceBWithSymbol"), (registry) => registry.resolve<ServiceB>("serviceB"))
            }))
            .build()
            .initialize()
        sandbox = document.body.appendChild(document.createElement('div'))
        testElement = sandbox.appendChild(document.createElement(tagName) as TestElement)

    })
    after(async () => {
        // @ts-ignore
        InversionBuilder.setDefaultContainer(undefined)
        container?.dispose()
    })
    it("should inject serviceA", function () {
        assert.property(testElement, "serviceA")
        assert.strictEqual(testElement.serviceA?.methodA(), "resultA")
    })
    it("should inject serviceB", function () {
        assert.property(testElement, "serviceB")
        assert.strictEqual(testElement.serviceB?.methodA(), "resultA")
        assert.property(testElement, "serviceBbis")
        assert.strictEqual(testElement.serviceBbis?.methodA(), "resultA")
    })
    it("should inject serviceBWithSymbol", function () {
        assert.property(testElement, "serviceBWithSymbol")
        assert.strictEqual(testElement.serviceBWithSymbol?.methodA(), "resultA")
    })
})
