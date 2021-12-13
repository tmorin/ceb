import { spy } from "sinon"
import { DomEvent } from "./message"
import { Event, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { assert } from "chai"

describe("DomEvent", function () {
  it("should execute the callback", async function () {
    const cb = spy()
    const event = MessageBuilder.event<string>("EventA").body("hello").build()
    const domEventA = new DomEvent<Event<string>>(event)
    await DomEvent.when(domEventA, "EventA", cb)
    assert.isTrue(cb.called, "callback has been called")
    assert.isTrue(cb.calledWith(event), "callback has been called with the bundled event")
  })
  it("should not execute the callback", async function () {
    const cb = spy()
    const event = MessageBuilder.event<string>("EventA").body("hello").build()
    const domEventA = new DomEvent<Event<string>>(event)
    await DomEvent.when(domEventA, "EventB", cb)
    assert.isFalse(cb.called, "callback has not been called")
  })
})
