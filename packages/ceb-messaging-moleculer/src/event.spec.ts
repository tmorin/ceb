import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { MoleculerEventBus } from "./event"
import { ServiceBroker } from "moleculer"
import { Event, EventListener, GatewayEmitter, MessageBuilder, SubscribeOptions } from "@tmorin/ceb-messaging-core"
import { spy } from "sinon"

chai.use(chasAsPromised)

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build()
}

describe("MoleculerEventBus", function () {
  const broker = new ServiceBroker({ logger: false })
  let listeners: Map<string, Set<[EventListener<any>, Partial<SubscribeOptions>]>>
  let emitter: GatewayEmitter
  let eventBus: MoleculerEventBus

  beforeEach(async () => {
    listeners = new Map()
    emitter = new GatewayEmitter()
    eventBus = new MoleculerEventBus(emitter, broker, {}, listeners)
    await broker.start()
  })
  afterEach(async function () {
    emitter.off()
    await eventBus?.dispose()
    await broker.stop()
  })

  it("should publish event", function (done) {
    broker.logger.info("in `it`")
    eventBus.subscribe("EventA", (event) => {
      assert.property(event, "body", "hello")
      done()
    })

    const eventA = createEventA("hello")
    eventBus.publish(eventA)
  })

  it("should listen to once", function (done) {
    eventBus.subscribe(
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
    eventBus.publish(eventA)
  })

  it("should remove listener", function () {
    const remover = eventBus.subscribe("EventA", spy())
    assert.equal(listeners.size, 1)
    assert.equal(listeners.get("EventA")?.size, 1)
    remover.remove()
    assert.equal(listeners.size, 1)
    assert.equal(listeners.get("EventA")?.size, 0)
  })

  it("should notify on failed sync listener", function (done) {
    const eventA = createEventA("hello")
    const errorA = new Error("an error")
    eventBus.subscribe("EventA", () => {
      throw errorA
    })
    eventBus.observer.on("event_listener_failed", ({ bus, event, error }) => {
      assert.equal(bus, bus)
      assert.equal(event, eventA)
      assert.equal(error, error)
      done()
    })
    eventBus.publish(eventA)
  })

  it("should notify on failed async listener", function (done) {
    const eventA = createEventA("hello")
    const errorA = new Error("an error")
    eventBus.subscribe("EventA", () => Promise.reject(errorA))
    eventBus.observer.on("event_listener_failed", ({ bus, event, error }) => {
      assert.equal(bus, bus)
      assert.equal(event, eventA)
      assert.equal(error, error)
      done()
    })
    eventBus.publish(eventA)
  })
})
