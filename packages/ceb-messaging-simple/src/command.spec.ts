import chai, {assert} from "chai"
import chasAsPromised from "chai-as-promised"
import {
    Action,
    Command,
    CommandHandler,
    Event,
    GatewayEmitter,
    MessageBuilder,
    Result
} from "@tmorin/ceb-messaging-core"
import {SimpleCommandBus} from "./command"
import {SimpleEventBus} from "./event"

chai.use(chasAsPromised)

function createCommandA(body: string): Command<string> {
    return MessageBuilder.command<string>("CommandA").body(body).build()
}

function createResultA(action: Action, body: string): Result<string> {
    return MessageBuilder.result<string>(action).body(body).build()
}

function createEventA(body: string): Event<string> {
    return MessageBuilder.event<string>("EventA").body(body).build()
}

describe.only("SimpleCommandBus", function () {
    let emitter: GatewayEmitter
    let handlers: Map<string, CommandHandler<any>>
    let eventBus: SimpleEventBus
    let bus: SimpleCommandBus
    beforeEach(async function () {
        emitter = new GatewayEmitter()
        handlers = new Map()
        eventBus = new SimpleEventBus(emitter)
        bus = new SimpleCommandBus(eventBus, emitter, handlers)
    })
    afterEach(async function () {
        emitter.off()
        await eventBus?.dispose()
        await bus?.dispose()
    })

    describe("when handler not found", () => {
        describe("#execute", () => {
            it("should notify", function (done) {
                const commandA = createCommandA("hello")
                bus.observe.on("command_handler_not_found", () => {
                    done()
                })
                bus.execute(commandA)
            })
            it("should failed", async function () {
                const commandA = createCommandA("hello")
                await assert.isRejected(bus.execute(commandA), "handler not found for CommandA")
            })
        })
        describe("#executeAndForget", () => {
            it("should notify", function (done) {
                const commandA = createCommandA("hello")
                bus.observe.on("command_handler_not_found", () => {
                    done()
                })
                bus.executeAndForget(commandA)
            })
        })
    })

    describe("when sync handler failed", () => {
        describe("#execute", () => {
            it("should notify", function (done) {
                const commandA = createCommandA("hello")
                bus.handle("CommandA", () => {
                    throw new Error("an error has been thrown")
                })
                bus.observe.on("command_handler_failed", () => {
                    done()
                })
                bus.execute(commandA)
            })
            it("should failed", async function () {
                const commandA = createCommandA("hello")
                bus.handle("CommandA", () => {
                    throw new Error("an error has been thrown")
                })
                await assert.isRejected(bus.execute(commandA), "an error has been thrown")
            })
        })
        describe("#executeAndForget", () => {
            it("should notify", function (done) {
                const commandA = createCommandA("hello")
                bus.handle("CommandA", () => {
                    throw new Error("an error has been thrown")
                })
                bus.observe.on("command_handler_failed", () => {
                    done()
                })
                bus.executeAndForget(commandA)
            })
        })
    })

    describe("when async handler failed", () => {
        describe("#execute", () => {
            it("should notify", function (done) {
                const commandA = createCommandA("hello")
                bus.handle("CommandA", async () => {
                    throw new Error("an error has been thrown")
                })
                bus.observe.on("command_handler_failed", () => {
                    done()
                })
                bus.execute(commandA)
            })
            it("should failed", async function () {
                const commandA = createCommandA("hello")
                bus.handle("CommandA", async () => {
                    throw new Error("an error has been thrown")
                })
                await assert.isRejected(bus.execute(commandA), "an error has been thrown")
            })
        })
        describe("#executeAndForget", () => {
            it("should notify", function (done) {
                const commandA = createCommandA("hello")
                bus.handle("CommandA", async () => {
                    throw new Error("an error has been thrown")
                })
                bus.observe.on("command_handler_failed", () => {
                    done()
                })
                bus.executeAndForget(commandA)
            })
        })
    })

    describe("when handler return nothing", () => {
        describe("#execute", () => {
            it("should return EmptyResult", async function () {
                const commandA = createCommandA("hello")
                bus.handle("CommandA", () => {
                })
                const resultA = await bus.execute(commandA)
                assert.property(resultA, "kind", "result")
                assert.property(resultA.headers, "messageType", "empty")
            })
        })
    })

    describe("when handler return a result", () => {
        describe("#execute", () => {
            it("should return the result", async function () {
                const commandA = createCommandA("hello")
                bus.handle<Command<string>, Result<string>>("CommandA", (command) => ({
                    result: createResultA(command, command.body)
                }))
                const resultA = await bus.execute(commandA)
                assert.property(resultA, "kind", "result")
                assert.property(resultA, "body", "hello")
            })
        })
    })

    describe("when handler return a result and events", () => {
        describe("#execute", () => {
            it("should return the result", function (done) {
                const commandA = createCommandA("hello")
                eventBus.subscribe("EventA", () => {
                    done()
                })
                bus.handle<Command<string>, Result<string>, [Event]>(
                    "CommandA",
                    () => ({
                        events: [createEventA("hello")]
                    })
                )
                bus.execute(commandA)
            })
        })
        describe("#executeAndForget", () => {
            it("should return the result", function (done) {
                const commandA = createCommandA("hello")
                eventBus.subscribe("EventA", () => {
                    done()
                })
                bus.handle<Command<string>, Result<string>, [Event]>(
                    "CommandA",
                    () => ({
                        events: [createEventA("hello")]
                    })
                )
                bus.executeAndForget(commandA)
            })
        })
    })
})
