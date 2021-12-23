import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { spy } from "sinon"
import { Container, ContainerBuilder, ModuleBuilder } from "@tmorin/ceb-inversion-core"
import {
  Action,
  Command,
  Event,
  Gateway,
  GatewaySymbol,
  MessageBuilder,
  Query,
  Result,
} from "@tmorin/ceb-messaging-core"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"
import { DiscoverableEventListener, DiscoverableEventListenerSymbol } from "./event"
import { DiscoverableCommandHandler, DiscoverableCommandHandlerSymbol } from "./command"
import { MessagingModule } from "./module"
import { DiscoverableQueryHandler, DiscoverableQueryHandlerSymbol } from "./query"

chai.use(chasAsPromised)

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build()
}

function createCommandA(body: string): Command<string> {
  return MessageBuilder.command<string>("CommandA").body(body).build()
}

function createQueryA(body: string): Query<string> {
  return MessageBuilder.query<string>("QueryA").body(body).build()
}

function createResultA(action: Action, body: string): Result<string> {
  return MessageBuilder.result<string>(action).body(body).build()
}

describe("ceb-messaging-inversion/MessagingModule", function () {
  const eventListenerSpy = spy()
  const eventListener: DiscoverableEventListener<Event<string>> = {
    type: "EventA",
    listener: eventListenerSpy,
  }

  const commandHandler: DiscoverableCommandHandler<Command<string>, Result<string>> = {
    type: "CommandA",
    handler: (command) => ({ result: createResultA(command, command.body) }),
  }
  const commandHandlerSpy = spy(commandHandler, "handler")

  const queryHandler: DiscoverableQueryHandler<Query<string>, Result<string>> = {
    type: "QueryA",
    handler: (query) => createResultA(query, query.body),
  }
  const queryHandlerSpy = spy(queryHandler, "handler")

  let container: Container
  let bus: Gateway
  beforeEach(async function () {
    container = await ContainerBuilder.get()
      .module(new MessagingModule())
      .module(
        ModuleBuilder.get()
          .configure(function (registry) {
            registry.registerValue(GatewaySymbol, SimpleGateway.create())
            registry.registerValue(DiscoverableEventListenerSymbol, eventListener)
            registry.registerValue(DiscoverableCommandHandlerSymbol, commandHandler)
            registry.registerValue(DiscoverableQueryHandlerSymbol, queryHandler)
          })
          .build()
      )
      .build()
      .initialize()
    bus = container.registry.resolve<Gateway>(GatewaySymbol)
  })
  afterEach(async function () {
    await container.registry.resolve<Gateway>(GatewaySymbol).dispose()
    await container.dispose()
  })
  it("should listen to an event", function () {
    const simpleEventA = createEventA("body content")
    bus.events.publish(simpleEventA)
    assert.ok(eventListenerSpy.calledOnce)
  })
  it("should handle command", async function () {
    const command = createCommandA("body content")
    const result = await bus.commands.execute(command)
    assert.ok(commandHandlerSpy.calledOnce)
    assert.ok(result)
    assert.equal(result.body, command.body)
  })
  it("should handle query", async function () {
    const query = createQueryA("body content")
    const result = await bus.queries.execute(query)
    assert.ok(queryHandlerSpy.calledOnce)
    assert.ok(result)
    assert.equal(result.body, query.body)
  })
})
