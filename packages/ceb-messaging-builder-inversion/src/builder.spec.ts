import { assert } from "chai"
import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { Gateway, GatewaySymbol } from "@tmorin/ceb-messaging-core"
import { Container, ContainerBuilder, OnlyConfigureModule } from "@tmorin/ceb-inversion-core"
import { GatewayInversionBuilder } from "./builder"
import { GatewayInversionBuilderModule } from "./module"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"

describe("ceb-messaging-builder-inversion/builder", function () {
  let container: Container
  let sandbox: HTMLDivElement
  let gateway: SimpleGateway

  describe("when container provided by module", function () {
    const tagName = "messaging-gateway-inversion-builder-module"
    let testElement: TestElementA

    class TestElementA extends HTMLElement {
      gateway?: Gateway
      gatewayBis?: Gateway
      gatewayAlternative?: Gateway
    }

    before(async function () {
      gateway = SimpleGateway.create()

      container = await ContainerBuilder.get()
        .module(
          OnlyConfigureModule.create(async function () {
            this.registry.registerValue(GatewaySymbol, gateway)
            this.registry.registerValue("gatewayAlternative", gateway)
          })
        )
        .module(new GatewayInversionBuilderModule())
        .build()
        .initialize()
      ElementBuilder.get(TestElementA)
        .name(tagName)
        .builder(
          GatewayInversionBuilder.get(),
          GatewayInversionBuilder.get("gatewayBis"),
          GatewayInversionBuilder.get("gatewayAlternative").key("gatewayAlternative")
        )
        .register()
      sandbox = document.body.appendChild(document.createElement("div"))
      testElement = sandbox.appendChild(document.createElement(tagName))
    })
    after(async function () {
      await container.dispose()
    })
    it("should resolve container with default settings", function () {
      assert.property(testElement, "gateway")
      assert.equal<any>(testElement.gateway, gateway)
    })
    it("should resolve container with custom property name", function () {
      assert.property(testElement, "gatewayBis")
      assert.equal<any>(testElement.gatewayBis, gateway)
    })
    it("should resolve container with custom registry key", function () {
      assert.property(testElement, "gatewayAlternative")
      assert.equal<any>(testElement.gatewayAlternative, gateway)
    })
  })

  describe("when container provided by provider", function () {
    const tagName = "messaging-gateway-inversion-builder-provider"
    let testElement: TestElementB
    let sandbox: HTMLDivElement

    class TestElementB extends HTMLElement {
      gateway?: Gateway
      gatewayBis?: Gateway
      gatewayAlternative?: Gateway
    }

    before(async function () {
      container = await ContainerBuilder.get()
        .module(
          OnlyConfigureModule.create(async function () {
            this.registry.registerValue(GatewaySymbol, gateway)
            this.registry.registerValue("gatewayAlternative", gateway)
          })
        )
        .build()
        .initialize()
      ElementBuilder.get(TestElementB)
        .name(tagName)
        .builder(
          GatewayInversionBuilder.get().provider(() => container),
          GatewayInversionBuilder.get("gatewayBis").provider(() => container),
          GatewayInversionBuilder.get("gatewayAlternative")
            .key("gatewayAlternative")
            .provider(() => container)
        )
        .register()
      sandbox = document.body.appendChild(document.createElement("div"))
      testElement = sandbox.appendChild(document.createElement(tagName))
    })
    after(async function () {
      await container.dispose()
    })
    it("should resolve container with default settings", function () {
      assert.property(testElement, "gateway")
      assert.equal<any>(testElement.gateway, gateway)
    })
    it("should resolve container with custom property name", function () {
      assert.property(testElement, "gatewayBis")
      assert.equal<any>(testElement.gatewayBis, gateway)
    })
    it("should resolve container with custom registry key", function () {
      assert.property(testElement, "gatewayAlternative")
      assert.equal<any>(testElement.gatewayAlternative, gateway)
    })
  })
})
