import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { Event, EventListener, GatewayEmitter, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { SimpleEventBus } from "./event"
import { spy } from "sinon"

chai.use(chasAsPromised)

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build()
}

describe("SimpleEventBus", function () {
  let emitter: GatewayEmitter
  let listeners: Map<string, Set<EventListener<any>>>
  let bus: SimpleEventBus
  beforeEach(async function () {
    emitter = new GatewayEmitter()
    listeners = new Map()
    bus = new SimpleEventBus(emitter, listeners)
  })
  afterEach(async function () {
    emitter.off()
    await bus?.dispose()
  })

  it("should publish event", function (done) {
    bus.subscribe("EventA", (event) => {
      assert.property(event, "body", "hello")
      done()
    })
    const eventA = createEventA("hello")
    bus.publish(eventA)
  })

  it("should listen to once", function (done) {
    bus.subscribe(
      "EventA",
      () =>
        setTimeout(() => {
          assert.equal(listeners.size, 1)
          assert.equal(listeners.get("EventA")?.size, 0)
          done()
        }, 0),
      { once: true }
    )
    const eventA = createEventA("hello")
    bus.publish(eventA)
  })

  it("should remove listener", function () {
    const remover = bus.subscribe("EventA", spy())
    assert.equal(listeners.size, 1)
    assert.equal(listeners.get("EventA")?.size, 1)
    remover.remove()
    assert.equal(listeners.size, 1)
    assert.equal(listeners.get("EventA")?.size, 0)
  })

  it("should notify on failed sync listener", function (done) {
    const eventA = createEventA("hello")
    const errorA = new Error("an error")
    bus.subscribe("EventA", () => {
      throw errorA
    })
    bus.observe.on("event_listener_failed", ({ bus, event, error }) => {
      assert.equal(bus, bus)
      assert.equal(event, eventA)
      assert.equal(error, error)
      done()
    })
    bus.publish(eventA)
  })

  it("should notify on failed async listener", function (done) {
    const eventA = createEventA("hello")
    const errorA = new Error("an error")
    bus.subscribe("EventA", () => Promise.reject(errorA))
    bus.observe.on("event_listener_failed", ({ bus, event, error }) => {
      assert.equal(bus, bus)
      assert.equal(event, eventA)
      assert.equal(error, error)
      done()
    })
    bus.publish(eventA)
  })
})
