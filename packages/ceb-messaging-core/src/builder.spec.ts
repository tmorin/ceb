import { expect } from "chai"
import { MessageBuilder } from "./builder"

describe("MessageBuilder", function () {
  describe("message", function () {
    it("should create a message", function () {
      const command = MessageBuilder.get("command").build()
      expect(command).property("kind", "command")
      expect(command).property("headers")
      expect(command.headers).property("messageType", "command")
      expect(command.headers).property("messageId")
      expect(command).property("body", undefined)
    })
    it("should set a type", function () {
      const command = MessageBuilder.get("command").type("test").build()
      expect(command.headers).property("messageType", "test")
    })
    it("should set an identifier", function () {
      const command = MessageBuilder.get("command").identifier("test").build()
      expect(command.headers).property("messageId", "test")
    })
    it("should set a header entry", function () {
      const command = MessageBuilder.get("command")
        .headers({
          key: "test",
        })
        .build()
      expect(command.headers).property("key", "test")
    })
    it("should set a body", function () {
      const command = MessageBuilder.get("command").body("test").build()
      expect(command).property("body", "test")
    })
  })
  describe("command", function () {
    it("should create a command", function () {
      const message = MessageBuilder.command("command").build()
      expect(message).property("kind", "command")
    })
  })
  describe("event", function () {
    it("should create a event", function () {
      const message = MessageBuilder.event("eventA").build()
      expect(message).property("kind", "event")
    })
  })
  describe("result", function () {
    it("should create a result", function () {
      const query = MessageBuilder.query("eventA").build()
      const message = MessageBuilder.result(query).build()
      expect(message).property("kind", "result")
    })
  })
  describe("query", function () {
    it("should create a query", function () {
      const message = MessageBuilder.query("queryA").build()
      expect(message).property("kind", "query")
    })
  })
})
