import chai, {assert} from "chai"
import chasAsPromised from "chai-as-promised"
import {Action, GatewayEmitter, MessageBuilder, Query, QueryHandler, Result} from "@tmorin/ceb-messaging-core"
import {SimpleQueryBus} from "./query"

chai.use(chasAsPromised)

function createQueryA(body: string): Query<string> {
    return MessageBuilder.query<string>("QueryA").body(body).build()
}

function createResultA(action: Action, body: string): Result<string> {
    return MessageBuilder.result<string>(action).body(body).build()
}

describe("SimpleQueryBus", function () {
    let emitter: GatewayEmitter
    let handlers: Map<string, QueryHandler<any>>
    let bus: SimpleQueryBus
    beforeEach(async function () {
        emitter = new GatewayEmitter()
        handlers = new Map()
        bus = new SimpleQueryBus(emitter, handlers)
    })
    afterEach(async function () {
        emitter.off()
        await bus?.dispose()
    })

    it("should handle a query", async function () {
        const queryA = createQueryA("hello")
        bus.handle<Query<string>, Result<string>>("QueryA", (query) => {
            return createResultA(query, query.body)
        })
        const resultA = await bus.execute(queryA)
        assert.property(resultA, "body", "hello")
    })

    it("should failed when handler not found", async function () {
        const queryA = createQueryA("hello")
        await assert.isRejected(bus.execute(queryA), "handler not found for QueryA")
    })

    it("should notify when handler not found", function (done) {
        const queryA = createQueryA("hello")
        bus.observe.on("query_handler_not_found", ({bus, query, error}) => {
            assert.equal(bus, bus)
            assert.equal(query, queryA)
            assert.equal(error, error)
            done()
        })
        bus.execute(queryA)
    })

    it("should failed when sync handler failed", async function () {
        const queryA = createQueryA("hello")
        bus.handle("QueryA", () => {
            throw new Error("an error has been thrown")
        })
        await assert.isRejected(bus.execute(queryA), "an error has been thrown")
    })

    it("should failed when async handler failed", async function () {
        const queryA = createQueryA("hello")
        bus.handle("QueryA", () =>
            Promise.reject(Error("an error has been thrown"))
        )
        await assert.isRejected(bus.execute(queryA), "an error has been thrown")
    })

    it("should notify when handler failed", function (done) {
        const queryA = createQueryA("hello")
        bus.handle("QueryA", () => {
            return Promise.reject(Error("an error has been thrown"))
        })
        bus.observe.on("query_handler_failed", ({bus, query, error}) => {
            assert.equal(bus, bus)
            assert.equal(query, queryA)
            assert.equal(error, error)
            done()
        })
        bus.execute(queryA)
    })

    it("should failed when not reply on time", async () => {
        const queryA = createQueryA("hello")
        bus.handle(
            "QueryA",
            () => new Promise<Result>(() => {
            })
        )
        await assert.isRejected(bus.execute(queryA, {timeout: 0}), "unable to get the result on time")
    })

    it("should notify when not reply on time", (done) => {
        const queryA = createQueryA("hello")
        bus.handle(
            "QueryA",
            () => new Promise<Result>(() => {
            })
        )
        bus.observe.on("query_handler_failed", ({bus, query, error}) => {
            assert.equal(bus, bus)
            assert.equal(query, queryA)
            assert.property(error, "message", "unable to get the result on time")
            done()
        })
        bus.execute(queryA)
    })
})
