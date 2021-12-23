import { assert } from "chai"
import { SinonSpy, spy } from "sinon"
import { Container, ContainerBuilder } from "./container"
import { DefaultRegistry } from "./registry"
import { ModuleBuilder } from "./module"
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
      configure: spy(),
      dispose: spy(),
    }
    const mock2 = {
      configure: spy(),
      dispose: spy(),
    }
    const spyConfigure1: SinonSpy = mock1.configure
    const spyConfigure2: SinonSpy = mock2.configure
    const spyDispose1: SinonSpy = mock1.dispose
    const spyDispose2: SinonSpy = mock2.dispose
    const container = await ContainerBuilder.get()
      .module(
        ModuleBuilder.get()
          .configure((registry) => {
            registry.registerValue(ComponentSymbol, mock1)
          })
          .build()
      )
      .module(
        ModuleBuilder.get()
          .configure((registry) => {
            registry.registerFactory(ComponentSymbol, () => mock2)
          })
          .build()
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
