import {assert} from "chai"
import sinon, {SinonSpy} from "sinon"
import {Container, ContainerBuilder} from "./container"
import {DefaultRegistry} from "./registry"
import {OnlyConfigureModule} from "./module"
import {ComponentSymbol} from "./component"

describe("inversion/container", () => {

    it("should initialize", async function () {
        const container = await ContainerBuilder.get()
            .build()
            .initialize()
        assert.instanceOf(container, Container)
        assert.ok(container.name)
    })

    it("should have a name", async function () {
        const container = await ContainerBuilder.get()
            .name("a container")
            .build()
            .initialize()
        assert.strictEqual(container.name, "a container")
    })

    it("should have a custom registry", async function () {
        const registry = new DefaultRegistry()
        const container = await ContainerBuilder.get()
            .registry(registry)
            .build()
            .initialize()
        assert.strictEqual(container.registry, container.registry)
    })


    it("should register component listener and dispose them", async function () {
        const mocks = {
            configure() {
            },
            dispose() {
            }
        }
        let spyConfigure: SinonSpy = sinon.spy(mocks, "configure")
        let spyDispose: SinonSpy = sinon.spy(mocks, "dispose")
        const container = await ContainerBuilder.get()
            .module(OnlyConfigureModule.create(async function () {
                this.registry.registerValue(ComponentSymbol, mocks)
            }))
            .build()
            .initialize()
        assert.strictEqual(container.registry, container.registry)
        assert.ok(spyConfigure.calledOnce)
        await container.dispose()
        assert.ok(spyDispose.calledOnce)
    })

})
