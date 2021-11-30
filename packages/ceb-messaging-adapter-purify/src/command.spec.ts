import { assert } from "chai"
import { EitherAsync, Just, Maybe } from "purify-ts"
import { Command, CommandHandler, GatewayEmitter, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { SimpleCommandBus, SimpleEventBus } from "@tmorin/ceb-messaging-simple"
import { createPurifyCommandHandlerOutput, PurifyCommandBus } from "./command"

function createCommandA(body: string): Command<string> {
  return MessageBuilder.command<string>("CommandA").body(body).build()
}

describe("PurifyCommandBus", function () {
  let emitter: GatewayEmitter
  let handlers: Map<string, CommandHandler<any>>
  let eventBus: SimpleEventBus
  let commandBus: SimpleCommandBus
  let purifyCommandBus: PurifyCommandBus
  beforeEach(async function () {
    emitter = new GatewayEmitter()
    handlers = new Map()
    eventBus = new SimpleEventBus(emitter)
    commandBus = new SimpleCommandBus(eventBus, emitter, handlers)
    purifyCommandBus = new PurifyCommandBus(commandBus)
  })
  afterEach(async function () {
    emitter.off()
    await eventBus?.dispose()
    await commandBus?.dispose()
  })

  it("should return a result", async function () {
    const commandA = createCommandA("hello")
    purifyCommandBus.handle("CommandA", (command) => {
      return EitherAsync(() => {
        return Promise.resolve(
          createPurifyCommandHandlerOutput<string>({
            result: Maybe.fromNullable(command.body),
          })
        )
      })
    })
    const result = await purifyCommandBus.execute<string>(commandA)
    assert.notOk(result.isLeft())
    assert.ok(result.isRight())
    const value = result.orDefault(Just("a value"))
    assert.equal(value.extract(), "hello")
  })

  it("should return an empty result", async function () {
    const commandA = createCommandA("hello")
    purifyCommandBus.handle("CommandA", () => {
      return EitherAsync(() => {
        return Promise.resolve(createPurifyCommandHandlerOutput<string>())
      })
    })
    const result = await purifyCommandBus.execute<string>(commandA)
    assert.notOk(result.isLeft())
    assert.ok(result.isRight())
    const value = result.orDefault(Just("a value"))
    assert.ok(value.isNothing())
  })

  it("should handle a failure", async function () {
    const commandA = createCommandA("hello")
    purifyCommandBus.handle("CommandA", () => {
      return EitherAsync(() => {
        return Promise.reject(new Error("an error"))
      })
    })
    const result = await purifyCommandBus.execute<string>(commandA)
    assert.ok(result.isLeft())
    assert.notOk(result.isRight())
    const error = result.swap().orDefault(new Error())
    assert.equal(error.message, "an error")
  })

  it("should execute and forget", function (done) {
    const commandA = createCommandA("hello")
    purifyCommandBus.handle("CommandA", () => {
      return EitherAsync(async () => {
        done()
        return createPurifyCommandHandlerOutput()
      })
    })
    purifyCommandBus.executeAndForget(commandA)
  })
})
