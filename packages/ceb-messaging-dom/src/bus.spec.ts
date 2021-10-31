import {assert} from 'chai'
import {MessageAction} from "@tmorin/ceb-messaging-core";
import {DomCommand, DomEvent, DomQuery, DomResult} from "./message";
import {DomBus} from "./bus";

class CommandA extends DomCommand<string> {
    constructor(body: string) {
        super(CommandA, body);
    }
}

class QueryA extends DomQuery<string> {
    constructor(body: string) {
        super(QueryA, body);
    }
}

class ResultA extends DomResult<string> {
    constructor(action: MessageAction, body: string) {
        super(ResultA, action, body);
    }
}

class ResultB extends DomResult<string> {
    constructor(action: MessageAction, body: string) {
        super(ResultB, action, body);
    }
}

class EventA extends DomEvent<string> {
    constructor(body: string) {
        super(EventA, body);
    }
}

describe("messaging/dom/bus", function () {
    let bus: DomBus;
    beforeEach(function () {
        bus = new DomBus(window)
    })
    afterEach(async function () {
        await bus?.stop()
    })
    describe("action", function () {
        it("should handle command", async function () {
            const commandA = new CommandA("test value")
            bus.handle(CommandA, ResultA, async (command) => new ResultA(command, command.body))
            const resultA = await bus.execute(commandA, ResultA)
            assert.ok(resultA)
            assert.strictEqual(resultA.body, commandA.body)
        })
        it("should handle failed command", async function () {
            const commandA = new QueryA("test value")
            bus.handle(QueryA, ResultA, async (query) => {
                throw new Error(query.body);
            })
            try {
                await bus.execute(commandA, ResultA)
                assert.fail()
            } catch (error: any) {
                assert.strictEqual(error.message, commandA.body)
            }
        })
        it("should handle timeout", async function () {
            const commandA = new QueryA("test value")
            bus.handle(QueryA, ResultA, async (command) => new ResultA(command, command.body))
            try {
                await bus.execute(commandA, ResultB, {timeout: 10})
                assert.fail()
            } catch (error: any) {
                assert.include(error.message, "unable to get a result after")
            }
        })
    })
    describe("event", function () {
        it("should subscribe to event", function (done) {
            const sentEventA = new EventA("test value")
            bus.subscribe(EventA, (receivedEventA) => {
                assert.strictEqual(receivedEventA, sentEventA)
                done()
            })
            bus.publish(sentEventA).catch(done)
        })
    })
})
