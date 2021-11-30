import { assert } from "chai"
import { SinonSpy, spy } from "sinon"
import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { Gateway, GatewaySymbol } from "@tmorin/ceb-messaging-core"
import { Container, ContainerBuilder, OnlyConfigureModule } from "@tmorin/ceb-inversion-core"
import { GatewayInversionBuilder } from "./builder"
import { GatewayInversionBuilderModule } from "./module"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"

describe("ceb-messaging-builder-inversion/builder/listener", function () {
  let sandbox: HTMLDivElement
  const tagName = "messaging-gateway-inversion-builder-listener"
  let container: Container
  let gateway: SimpleGateway
  let spiedSubscribe: SinonSpy

  class TestElement extends HTMLElement {
    gateway?: Gateway
  }

  before(async function () {
    gateway = SimpleGateway.create()
    spiedSubscribe = spy(gateway.events, "subscribe")
    container = await ContainerBuilder.get()
      .module(
        OnlyConfigureModule.create(async function () {
          this.registry.registerValue(GatewaySymbol, gateway)
        })
      )
      .module(new GatewayInversionBuilderModule())
      .build()
      .initialize()
    ElementBuilder.get(TestElement)
      .name(tagName)
      .builder(GatewayInversionBuilder.get().subscribe("EventA", spy()))
      .register()
    sandbox = document.body.appendChild(document.createElement("div"))
    sandbox.appendChild(document.createElement(tagName))
  })

  after(async function () {
    spiedSubscribe.restore()
    await container.dispose()
  })

  it("should subscribe", function () {
    assert.equal(spiedSubscribe.callCount, 1)
  })
})
