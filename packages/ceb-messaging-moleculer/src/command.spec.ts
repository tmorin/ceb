import { spy } from "sinon"
import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { Action, Command, Event, GatewayEmitter, MessageBuilder, Result } from "@tmorin/ceb-messaging-core"
import { MoleculerEventBus } from "./event"
import { MoleculerCommandBus } from "./command"
import { ServiceBroker } from "moleculer"

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

describe("MoleculerCommandBus", function () {
  const commandA = createCommandA("hello")
  const broker = new ServiceBroker({ logger: false })
  let emitter: GatewayEmitter
  let eventBus: MoleculerEventBus
  let bus: MoleculerCommandBus
  beforeEach(async function () {
    emitter = new GatewayEmitter()
    eventBus = new MoleculerEventBus(emitter, broker)
    bus = new MoleculerCommandBus(eventBus, emitter, broker)
  })
  afterEach(async function () {
    emitter.off()
    await eventBus.dispose()
    await bus.dispose()
    await broker.stop()
  })

  describe("when sync handler failed", () => {
    beforeEach(async () => {
      bus.handle("CommandA", () => {
        throw new Error("an error has been thrown")
      })
      return broker.start()
    })
    describe("#execute", () => {
      it("should notify", function (done) {
        bus.observer.on("command_handler_failed", () => {
          done()
        })
        bus.execute(commandA).catch(spy())
      })
      it("should failed", async function () {
        await assert.isRejected(bus.execute(commandA), "an error has been thrown")
      })
    })
    describe("#executeAndForget", () => {
      it("should notify", function (done) {
        bus.observer.on("command_handler_failed", () => {
          done()
        })
        bus.executeAndForget(commandA)
      })
    })
  })

  describe("when async handler failed", () => {
    beforeEach(async () => {
      bus.handle("CommandA", async () => {
        throw new Error("an error has been thrown")
      })
      return broker.start()
    })
    describe("#execute", () => {
      it("should notify", function (done) {
        bus.observer.on("command_handler_failed", () => {
          done()
        })
        bus.execute(commandA).catch(spy())
      })
      it("should failed", async function () {
        await assert.isRejected(bus.execute(commandA), "an error has been thrown")
      })
    })
    describe("#executeAndForget", () => {
      it("should notify", function (done) {
        bus.observer.on("command_handler_failed", () => {
          done()
        })
        bus.executeAndForget(commandA)
      })
    })
  })

  describe("when handler return nothing", () => {
    beforeEach(async () => {
      bus.handle("CommandA", spy())
      return broker.start()
    })
    describe("#execute", () => {
      it("should return EmptyResult", async function () {
        const resultA = await bus.execute(commandA)
        broker.logger.info("resultA", resultA)
        assert.property(resultA, "kind", "result")
        assert.property(resultA.headers, "messageType", "empty")
      })
    })
  })

  describe("when handler return a result", () => {
    beforeEach(async () => {
      bus.handle<Command<string>, Result<string>>("CommandA", (command) => ({
        result: createResultA(command, command.body),
      }))
      return broker.start()
    })
    describe("#execute", () => {
      it("should return the result", async function () {
        const resultA = await bus.execute(commandA)
        assert.property(resultA, "kind", "result")
        assert.property(resultA, "body", "hello")
      })
    })
  })

  describe("when handler return a result and events", () => {
    describe("#execute", () => {
      beforeEach(async () => {
        bus.handle<Command<string>, Result<string>, [Event]>("CommandA", () => ({
          events: [createEventA("hello")],
        }))
        return broker.start()
      })
      it("should return the result", function (done) {
        eventBus.subscribe("EventA", () => {
          done()
        })
        bus.execute(commandA).catch(spy())
      })
    })
    describe("#executeAndForget", () => {
      beforeEach(async () => {
        bus.handle<Command<string>, Result<string>, [Event]>("CommandA", () => ({
          events: [createEventA("hello")],
        }))
        return broker.start()
      })
      it("should return the result", function (done) {
        eventBus.subscribe("EventA", () => {
          done()
        })
        bus.executeAndForget(commandA)
      })
    })
  })
})
