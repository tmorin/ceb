import chai, { assert } from "chai"
import chasAsPromised from "chai-as-promised"
import { spy } from "sinon"
import { Container, ContainerBuilder, OnlyConfigureModule } from "@tmorin/ceb-inversion-core"
import {
  Action,
  Command,
  DiscoverableCommandHandler,
  DiscoverableCommandHandlerSymbol,
  DiscoverableEventListener,
  DiscoverableEventListenerSymbol,
  Event,
  Gateway,
  GatewaySymbol,
  MessageBuilder,
  MessagingModule,
  Result,
} from "@tmorin/ceb-messaging-core"
import { SimpleModule } from "./inversion"

chai.use(chasAsPromised)

function createEventA(body: string): Event<string> {
  return MessageBuilder.event<string>("EventA").body(body).build()
}

function createCommandA(body: string): Command<string> {
  return MessageBuilder.command<string>("CommandA").body(body).build()
}

function createResultA(action: Action, body: string): Result<string> {
  return MessageBuilder.result<string>(action).body(body).build()
}

describe("ceb-messaging-simple/SimpleModule", function () {
  const eventListenerSpy = spy()
  const eventListener: DiscoverableEventListener<Event<string>> = {
    type: "EventA",
    listener: eventListenerSpy,
  }

  const commandHandler: DiscoverableCommandHandler<Command<string>, Result<string>> = {
    type: "CommandA",
    handler: (command) => ({ result: createResultA(command, command.body) }),
  }
  const handlerSpy = spy(commandHandler, "handler")

  let container: Container
  let bus: Gateway
  beforeEach(async function () {
    container = await ContainerBuilder.get()
      .module(new SimpleModule())
      .module(new MessagingModule())
      .module(
        OnlyConfigureModule.create(async function () {
          this.registry.registerValue(DiscoverableEventListenerSymbol, eventListener)
          this.registry.registerValue(DiscoverableCommandHandlerSymbol, commandHandler)
        })
      )
      .build()
      .initialize()
    bus = container.registry.resolve<Gateway>(GatewaySymbol)
  })
  afterEach(async function () {
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
    assert.ok(handlerSpy.calledOnce)
    assert.ok(result)
    assert.equal(result.body, command.body)
  })
})
