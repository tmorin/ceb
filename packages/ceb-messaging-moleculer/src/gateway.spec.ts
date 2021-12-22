import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { Action, Command, Event, GatewayEmitter, MessageBuilder, Query, Result } from "@tmorin/ceb-messaging-core"
import { MoleculerCommandBus } from "./command"
import { MoleculerEventBus } from "./event"
import { MoleculerQueryBus } from "./query"
import { MoleculerGateway } from "./gateway"
import { ServiceBroker } from "moleculer"

chai.use(chasAsPromised)

function createCommandA(body: string): Command<string> {
  return MessageBuilder.command<string>("CommandA").body(body).build()
}

function createQueryA(body: string): Query<string> {
  return MessageBuilder.query<string>("QueryA").body(body).build()
}

function createResultA(action: Action, body: string): Result<string> {
  return MessageBuilder.result<string>(action).body(body).build()
}

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build()
}

describe("MoleculerObservableGateway", function () {
  const commandA = createCommandA("hello")
  const queryA = createQueryA("hello")
  const eventA = createEventA("hello")
  const broker = new ServiceBroker({ logger: false })
  let emitter: GatewayEmitter
  let eventBus: MoleculerEventBus
  let commandBus: MoleculerCommandBus
  let queryBus: MoleculerQueryBus
  let gateway: MoleculerGateway
  beforeEach(async function () {
    emitter = new GatewayEmitter()
    eventBus = new MoleculerEventBus(emitter, broker)
    commandBus = new MoleculerCommandBus(eventBus, emitter, broker)
    queryBus = new MoleculerQueryBus(emitter, broker)
    gateway = new MoleculerGateway(eventBus, commandBus, queryBus, emitter)
    commandBus.handle<Command<string>, Result<string>>("CommandA", (command) => ({
      result: createResultA(command, command.body),
    }))
    queryBus.handle<Query<string>, Result<string>>("QueryA", (query) => createResultA(query, query.body))
    await broker.start()
  })
  afterEach(async function () {
    await gateway?.dispose()
    await broker.stop()
  })

  it("should execute command", async function () {
    const resultA = await commandBus.execute<Result<string>>(commandA)
    assert.property(resultA, "body", "hello")
  })

  it("should execute query", async function () {
    const resultA = await queryBus.execute<Result<string>>(queryA)
    assert.property(resultA, "body", "hello")
  })

  it("should execute subscribe to event", function (done) {
    eventBus.subscribe("EventA", () => done())
    eventBus.publish(eventA)
  })
})
