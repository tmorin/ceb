import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { spy } from "sinon"
import { ObservedEventListener } from "./observable"
import { GatewayEmitter } from "./gateway"

chai.use(chasAsPromised)

describe("GatewayEmitter", function () {
  let emitter: GatewayEmitter
  let listeners: Map<string, Set<ObservedEventListener>>
  beforeEach(() => {
    listeners = new Map([["event_0", new Set([spy()])]])
    emitter = new GatewayEmitter(listeners)
  })
  afterEach(() => {
    emitter.off()
    listeners.clear()
  })

  it("should emit event", function (done) {
    emitter.on("event_a", (event) => {
      assert.equal(event, "hello")
      done()
    })
    emitter.emit("event_a", "hello")
  })

  it("should remove all listeners", function () {
    emitter.on("event_a", spy())
    assert.equal(listeners.size, 2)
    emitter.off()
    assert.equal(listeners.size, 0)
  })

  it("should remove all listeners for a given a type", function () {
    emitter.on("event_a", spy())
    assert.equal(listeners.get("event_a")?.size, 1)
    emitter.off("event_a")
    assert.equal(listeners.has("event_a"), false)
  })

  it("should remove all listeners for a given a listener", function () {
    const listener = spy()
    emitter.on("event_a", listener)
    assert.equal(listeners.get("event_a")?.size, 1)
    emitter.off("event_a", listener)
    assert.equal(listeners.get("event_a")?.size, 0)
  })
})
