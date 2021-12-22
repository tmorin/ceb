import { assert } from "chai"
import { Container, ContainerBuilder } from "@tmorin/ceb-inversion-core"
import { Gateway, GatewaySymbol } from "@tmorin/ceb-messaging-core"
import { MoleculerModule } from "./module"
import { ServiceBroker } from "moleculer"

describe("ceb-messaging-moleculer-inversion/MoleculerModule", function () {
  let container: Container
  beforeEach(async function () {
    container = await ContainerBuilder.get()
      .module(
        new MoleculerModule({
          broker: new ServiceBroker(),
        })
      )
      .build()
      .initialize()
  })
  afterEach(async function () {
    await container.dispose()
  })
  it("should provide a Gateway", function () {
    assert.ok(container.registry.resolve<Gateway>(GatewaySymbol))
  })
})
