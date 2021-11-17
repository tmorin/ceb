import {assert} from 'chai'
import {SimpleVoidResult} from "./message";
import {InMemorySimpleBus} from "./bus";
import {CommandA, EventA, QueryA, ResultA, ResultB} from "./__TEST/fixture";

describe("messaging/simple/bus", function () {
    let bus: InMemorySimpleBus;
    beforeEach(function () {
        bus = new InMemorySimpleBus()
    })
    afterEach(async function () {
        await bus?.dispose()
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
            bus.handle(QueryA.name, ResultB, async (query) => new ResultB(query.body))
            const resultA = await bus.execute(queryA, ResultA)
            assert.ok(resultA)
            assert.strictEqual(resultA.body, queryA.body)
        })
    })
    describe("event", function () {
        it("should listen to event", function (done) {
            const eventA = new EventA("test value")
            bus.subscribe(EventA.name, (event) => {
                assert.strictEqual(event, eventA)
                done()
            })
            bus.publish(eventA)
        })
    })
})
