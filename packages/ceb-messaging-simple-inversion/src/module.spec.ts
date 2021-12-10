import { assert } from "chai"
import { Container, ContainerBuilder } from "@tmorin/ceb-inversion-core"
import { Gateway, GatewaySymbol } from "@tmorin/ceb-messaging-core"
import { SimpleModule } from "./module"

describe("ceb-messaging-simple-inversion/SimpleModule", function () {
  let container: Container
  beforeEach(async function () {
    container = await ContainerBuilder.get().module(new SimpleModule()).build().initialize()
  })
  afterEach(async function () {
    await container.dispose()
  })
  it("should provide a Gateway", function () {
    assert.ok(container.registry.resolve<Gateway>(GatewaySymbol))
  })
})
