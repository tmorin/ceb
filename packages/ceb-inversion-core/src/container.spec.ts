import { assert } from "chai"
import sinon, { SinonSpy } from "sinon"
import { Container, ContainerBuilder } from "./container"
import { DefaultRegistry } from "./registry"
import { OnlyConfigureModule } from "./module"
import { ComponentSymbol } from "./component"

describe("inversion/container", () => {
  it("should initialize", async function () {
    const container = await ContainerBuilder.get().build().initialize()
    assert.instanceOf(container, Container)
    assert.ok(container.name)
  })

  it("should have a name", async function () {
    const container = await ContainerBuilder.get().name("a container").build().initialize()
    assert.strictEqual(container.name, "a container")
  })

  it("should have a custom registry", async function () {
    const registry = new DefaultRegistry()
    const container = await ContainerBuilder.get().registry(registry).build().initialize()
    assert.strictEqual(container.registry, container.registry)
  })

  it("should register component listener and dispose them", async function () {
    const mock1 = {
      configure() {},
      dispose() {},
    }
    const mock2 = {
      configure() {},
      dispose() {},
    }
    let spyConfigure1: SinonSpy = sinon.spy(mock1, "configure")
    let spyConfigure2: SinonSpy = sinon.spy(mock2, "configure")
    let spyDispose1: SinonSpy = sinon.spy(mock1, "dispose")
    let spyDispose2: SinonSpy = sinon.spy(mock2, "dispose")
    const container = await ContainerBuilder.get()
      .module(
        OnlyConfigureModule.create(async function () {
          this.registry.registerValue(ComponentSymbol, mock1)
        })
      )
      .module(
        OnlyConfigureModule.create(async function () {
          this.registry.registerFactory(ComponentSymbol, () => mock2)
        })
      )
      .build()
      .initialize()
    assert.strictEqual(container.registry, container.registry)
    assert.ok(spyConfigure1.calledOnce)
    assert.ok(spyConfigure2.calledOnce)
    await container.dispose()
    assert.ok(spyDispose1.calledOnce)
    assert.ok(spyDispose2.calledOnce)
  })
})
