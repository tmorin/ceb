import { assert } from "chai"
import sinon, { SinonSpy } from "sinon"
import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { Event, Gateway, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { SimpleGatewayBuilder } from "./builder"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build()
}

describe("ceb-messaging-simple-builder/builder", function () {
  let sandbox: HTMLDivElement
  const tagName = "messaging-simple-gateway-builder"
  let testElement: TestElement
  let eventAListener: SinonSpy = sinon.spy()

  class TestElement extends HTMLElement {
    gateway?: Gateway
    gatewayBis?: Gateway
  }

  before(function () {
    sandbox = document.body.appendChild(document.createElement("div"))
    ElementBuilder.get(TestElement)
      .name(tagName)
      .builder(SimpleGatewayBuilder.get().subscribe("EventA", eventAListener), SimpleGatewayBuilder.get("gatewayBis"))
      .register()
    testElement = sandbox.appendChild(document.createElement(tagName))
  })

  it("should have a default gateway property", function () {
    assert.property(testElement, "gateway")
    assert.instanceOf(testElement.gateway, SimpleGateway)
  })

  it("should share the same gateway instance", function () {
    assert.instanceOf(testElement.gatewayBis, SimpleGateway)
    assert.strictEqual(testElement.gatewayBis, testElement.gateway)
  })

  it("should listen to event", async function () {
    const eventA = createEventA("test value")

    await SimpleGateway.GLOBAL.events.publish(eventA)
    assert.ok(eventAListener.calledOnce)
    assert.ok(eventAListener.calledWith(testElement, eventA))

    testElement?.parentElement?.removeChild(testElement)
    await SimpleGateway.GLOBAL.events.publish(eventA)
    assert.ok(eventAListener.calledOnce)
    assert.ok(eventAListener.calledWith(testElement, eventA))

    sandbox.appendChild(testElement)
    await SimpleGateway.GLOBAL.events.publish(eventA)
    assert.ok(eventAListener.calledTwice)
    assert.ok(eventAListener.calledWith(testElement, eventA))
  })
})
