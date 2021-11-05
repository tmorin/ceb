import {assert} from "chai";
import {AbstractSimpleCommand, AbstractSimpleEvent} from "./message";

class TestEvent extends AbstractSimpleEvent<string> {
    static MESSAGE_TYPE: string = "TestEventBis"

    constructor(body: string) {
        super(body);
    }
}

class TestCommand extends AbstractSimpleCommand<string> {
    static MESSAGE_TYPE: string = "TestCommandBis"

    constructor(body: string) {
        super(body);
    }
}

describe("messaging/simple/message", function () {
    it("should discover TestEventBis", function () {
        const testEvent = new TestEvent("test")
        assert.equal(testEvent.headers.messageType, TestEvent.MESSAGE_TYPE)
    })
    it("should discover TestCommandBis", function () {
        const testCommand = new TestCommand("test")
        assert.equal(testCommand.headers.messageType, TestCommand.MESSAGE_TYPE)
    })
})
