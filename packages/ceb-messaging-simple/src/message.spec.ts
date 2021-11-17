import {assert} from "chai";
import {CommandWithMessageType, EventWithMessageType} from "./__TEST/fixture";

describe("messaging/simple/message", function () {
    it("should discover TestEventBis", function () {
        const testEvent = new EventWithMessageType("test")
        assert.equal(testEvent.headers.messageType, EventWithMessageType.MESSAGE_TYPE)
    })
    it("should discover TestCommandBis", function () {
        const testCommand = new CommandWithMessageType("test")
        assert.equal(testCommand.headers.messageType, CommandWithMessageType.MESSAGE_TYPE)
    })
})
