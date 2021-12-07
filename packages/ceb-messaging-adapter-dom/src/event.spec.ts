import { assert } from "chai"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"
import { EventBridge } from "./event"
import { Gateway, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { DomEvent } from "./message"

describe("EventBridge", function () {
  let div: HTMLDivElement
  let gateway: Gateway
  let adapter: EventBridge
  beforeEach(async function () {
    div = document.body.appendChild(document.createElement("div"))
    gateway = SimpleGateway.create()
    adapter = new EventBridge(window, gateway)
    await adapter.configure()
  })
  afterEach(async function () {
    await adapter.dispose()
    await gateway.dispose()
  })
  describe("#publish", function () {
    it("should handle events published within the DOM context", function (done) {
      gateway.events.subscribe(
        "EventA",
        (event) => {
          assert.property(event, "body", "hello")
          done()
        },
        { once: true }
      )
      const event = new DomEvent(MessageBuilder.event("EventA").body("hello").build())
      div.dispatchEvent(event)
    })
    it("should handle events published from the Gateway", function (done) {
      const event = MessageBuilder.event("EventA").body("hello").build()
      window.addEventListener(
        DomEvent.CUSTOM_EVENT_TYPE,
        (event) => {
          if (event instanceof DomEvent) {
            assert.property(event.detail, "body", "hello")
          } else {
            assert.fail("should be a DomEvent")
          }
          done()
        },
        { once: true }
      )
      gateway.events.publish(event)
    })
  })
})
