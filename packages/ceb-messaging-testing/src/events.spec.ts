import assert from "assert"
import { Event, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"
import { waitForEvents } from "./events"

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build()
}

describe("ceb-messaging-testing/events", function () {
  let gateway: SimpleGateway
  before(function () {
    gateway = SimpleGateway.create()
  })
  after(async function () {
    await gateway.dispose()
  })
  describe("waitForEvents", function () {
    it("should wait for 1 event", async function () {
      const p = waitForEvents(gateway, "EventA")
      gateway.events.publish(createEventA("hello"))
      const events = await p
      assert.ok(events)
      assert.strictEqual(events.length, 1)
      assert.strictEqual(events[0].body, "hello")
    })
    it("should wait for 2 events", async function () {
      const p = waitForEvents(gateway, "EventA", { occurrences: 2 })
      gateway.events.publish(createEventA("hello"))
      gateway.events.publish(createEventA("world"))
      const events = await p
      assert.ok(events)
      assert.strictEqual(events.length, 2)
      assert.strictEqual(events[0].body, "hello")
      assert.strictEqual(events[1].body, "world")
    })
    it("should fails when no event published", async function () {
      const result = await waitForEvents(gateway, "EventA", { timeout: 0 })
        .then(() => undefined)
        .catch((e: Error) => e)
      assert.ok(result)
      assert.strictEqual(result.message, "unable to get expected events on time")
    })
  })
})
