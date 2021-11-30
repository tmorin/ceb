import { assert } from "chai"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"
import { Gateway, MessageBuilder, Query, Result } from "@tmorin/ceb-messaging-core"
import { QueryForwarder } from "./query"
import { DomQuery, DomResult } from "./message"

describe("QueryForwarder", function () {
  let div: HTMLDivElement
  let gateway: Gateway
  let adapter: QueryForwarder
  beforeEach(async function () {
    div = document.body.appendChild(document.createElement("div"))
    gateway = SimpleGateway.create()
    adapter = new QueryForwarder(gateway, window)
    await adapter.configure()
  })
  afterEach(async function () {
    await adapter.dispose()
    await gateway.dispose()
  })
  describe("#execute", function () {
    it("should handle results", function (done) {
      gateway.queries.handle<Query<string>, Result<string>>("QueryA", (query) => {
        return MessageBuilder.result(query).body(query.body).build()
      })
      div.addEventListener(
        DomResult.CUSTOM_EVENT_TYPE,
        (event) => {
          assert.nestedProperty(event, "detail.body", "hello")
          done()
        },
        { once: true }
      )
      const event = new DomQuery(MessageBuilder.query("QueryA").body("hello").build())
      div.dispatchEvent(event)
    })
    it("should handle errors", function (done) {
      gateway.queries.handle<Query<string>, Result<string>>("QueryB", async () => {
        throw new Error("an error")
      })
      div.addEventListener(
        DomResult.CUSTOM_EVENT_TYPE,
        (event) => {
          assert.nestedProperty(event, "detail.body.message", "an error")
          done()
        },
        { once: true }
      )
      const event = new DomQuery(MessageBuilder.query("QueryB").body("hello").build())
      div.dispatchEvent(event)
    })
  })
})
