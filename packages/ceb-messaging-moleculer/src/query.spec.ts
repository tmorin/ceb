import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { Action, GatewayEmitter, MessageBuilder, Query, QueryHandler, Result } from "@tmorin/ceb-messaging-core"
import { spy } from "sinon"
import { MoleculerQueryBus } from "./query"
import { ServiceBroker } from "moleculer"
import { MoleculerEventBus } from "./event"
import { MoleculerCommandBus } from "./command"

chai.use(chasAsPromised)

function createQueryA(body: string): Query<string> {
  return MessageBuilder.query<string>("QueryA").body(body).build()
}

function createResultA(action: Action, body: string): Result<string> {
  return MessageBuilder.result<string>(action).body(body).build()
}

describe("SimpleQueryBus", function () {
  const queryA = createQueryA("hello")
  const broker = new ServiceBroker({ logger: false })
  let emitter: GatewayEmitter
  let bus: MoleculerQueryBus
  beforeEach(async function () {
    emitter = new GatewayEmitter()
    bus = new MoleculerQueryBus(emitter, broker)
  })
  afterEach(async function () {
    emitter.off()
    await bus.dispose()
    await broker.stop()
  })

  describe("a query handler", function () {
    beforeEach(async () => {
      bus.handle<Query<string>, Result<string>>("QueryA", (query) => {
        return createResultA(query, query.body)
      })
      await broker.start()
    })
    it("should handle a query", async function () {
      const resultA = await bus.execute(queryA)
      assert.property(resultA, "body", "hello")
    })
  })

  describe("a failing query handler", function () {
    beforeEach(async () => {
      bus.handle("QueryA", () => {
        throw new Error("an error has been thrown")
      })
      await broker.start()
    })
    it("should failed when sync handler failed", async function () {
      await assert.isRejected(bus.execute(queryA), "an error has been thrown")
    })
  })

  describe("an async failing query handler", function () {
    beforeEach(async () => {
      bus.handle("QueryA", () => Promise.reject(Error("an error has been thrown")))
      await broker.start()
    })
    it("should failed when async handler failed", async function () {
      await assert.isRejected(bus.execute(queryA), "an error has been thrown")
    })
    it("should notify when handler failed", function (done) {
      bus.observer.on("query_handler_failed", ({ bus, query, error }) => {
        assert.equal(bus, bus)
        assert.equal(query, queryA)
        assert.equal(error, error)
        done()
      })
      bus.execute(queryA).catch(spy())
    })
  })
})
