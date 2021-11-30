import { assert } from "chai"
import { Container, ContainerBuilder } from "@tmorin/ceb-inversion-core"
import { SimpleGatewaySymbol, SimpleModule } from "@tmorin/ceb-messaging-simple"
import { Gateway, GatewaySymbol } from "@tmorin/ceb-messaging-core"
import { PurifyModule } from "./inversion"
import { PurifyGateway } from "./gateway"

describe("PurifyModule", function () {
  let container: Container
  before(async function () {
    container = await ContainerBuilder.get()
      .module(
        new SimpleModule({
          gatewayRegistryKey: SimpleGatewaySymbol,
        })
      )
      .module(new PurifyModule())
      .build()
      .initialize()
  })
  after(async function () {
    await container.dispose()
  })
  it("should provide the gateway", function () {
    const gateway = container.registry.resolve<Gateway>(GatewaySymbol)
    assert.ok(gateway)
    assert.instanceOf(gateway, PurifyGateway)
  })
})
