import { assert } from "chai"
import { EitherAsync, Just, Maybe, Nothing } from "purify-ts"
import { GatewayEmitter, MessageBuilder, Query, QueryHandler } from "@tmorin/ceb-messaging-core"
import { SimpleQueryBus } from "@tmorin/ceb-messaging-simple"
import { PurifyQueryBus } from "./query"

function createQueryA(body: string): Query<string> {
  return MessageBuilder.query<string>("QueryA").body(body).build()
}

describe("PurifyQueryBus", function () {
  let emitter: GatewayEmitter
  let handlers: Map<string, QueryHandler<any>>
  let queryBus: SimpleQueryBus
  let purifyQueryBus: PurifyQueryBus
  beforeEach(async function () {
    emitter = new GatewayEmitter()
    handlers = new Map()
    queryBus = new SimpleQueryBus(emitter, handlers)
    purifyQueryBus = new PurifyQueryBus(queryBus)
  })
  afterEach(async function () {
    emitter.off()
    await queryBus?.dispose()
  })

  it("should return a result", async function () {
    const queryA = createQueryA("hello")
    purifyQueryBus.handle("QueryA", (query) => {
      return EitherAsync<Error, Maybe<string>>(() => {
        return Promise.resolve(Maybe.fromNullable(query.body))
      })
    })
    const result = await purifyQueryBus.execute<string>(queryA)
    assert.notOk(result.isLeft())
    assert.ok(result.isRight())
    const value = result.orDefault(Just("a value"))
    assert.equal(value.extract(), "hello")
  })

  it("should return an empty result", async function () {
    const queryA = createQueryA("hello")
    purifyQueryBus.handle("QueryA", () => {
      return EitherAsync<Error, Maybe<string>>(() => {
        return Promise.resolve(Nothing)
      })
    })
    const result = await purifyQueryBus.execute<string>(queryA)
    assert.notOk(result.isLeft())
    assert.ok(result.isRight())
    const value = result.orDefault(Just("a value"))
    assert.ok(value.isNothing())
  })

  it("should handle a failure", async function () {
    const queryA = createQueryA("hello")
    purifyQueryBus.handle("QueryA", () => {
      return EitherAsync<Error, Maybe<string>>(() => {
        return Promise.reject(new Error("an error"))
      })
    })
    const result = await purifyQueryBus.execute<string>(queryA)
    assert.ok(result.isLeft())
    assert.notOk(result.isRight())
    const error = result.swap().orDefault(new Error())
    assert.equal(error.message, "an error")
  })
})
