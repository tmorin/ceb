import {assert} from 'chai'
import {
    AbstractSimpleCommand,
    AbstractSimpleEvent,
    AbstractSimpleQuery,
    AbstractSimpleResult,
    InMemorySimpleBus,
    SimpleVoidResult
} from "../../../src/messaging";

class CommandA extends AbstractSimpleCommand<string> {
    constructor(body: string) {
        super(body);
    }
}

class QueryA extends AbstractSimpleQuery<string> {
    constructor(body: string) {
        super(body);
    }
}

class ResultA extends AbstractSimpleResult<string> {
    constructor(body: string) {
        super(body);
    }
}

class ResultB extends AbstractSimpleResult<string> {
    constructor(body: string) {
        super(body);
    }
}

class EventA extends AbstractSimpleEvent<string> {
    constructor(body: string) {
        super(body);
    }
}

describe("messaging/simple/bus", function () {
    let bus: InMemorySimpleBus;
    beforeEach(function () {
        bus = new InMemorySimpleBus()
    })
    afterEach(async function () {
        await bus?.destroy()
    })
    describe("action", function () {
        it("should execute a command and wait for result", async function () {
            const commandA = new CommandA("test value")
            bus.handle(CommandA, ResultA, async (command) => new ResultA(command.body))
            const resultA = await bus.execute(commandA, ResultA)
            assert.ok(resultA)
            assert.strictEqual(resultA.body, commandA.body)
        })
        it("should execute a command forget", function (done) {
            const commandA = new CommandA("test value")
            bus.handle(CommandA, SimpleVoidResult, (command) => {
                assert.strictEqual(command, commandA)
                done()
            })
            bus.execute(commandA, ResultA).catch(done)
        })
        it("should execute a query and wait for result", async function () {
            const queryA = new QueryA("test value")
            bus.handle(QueryA, ResultB, async (query) => new ResultB(query.body))
            const resultA = await bus.execute(queryA, ResultA)
            assert.ok(resultA)
            assert.strictEqual(resultA.body, queryA.body)
        })
    })
    describe("event", function () {
        it("should listen to event", function (done) {
            const eventA = new EventA("test value")
            bus.subscribe(EventA, (event) => {
                assert.strictEqual(event, eventA)
                done()
            })
            bus.publish(eventA)
        })
    })
})
