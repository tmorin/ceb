import {assert} from 'chai'
import {SimpleVoidResult} from "./message";
import {InMemorySimpleBus} from "./bus";
import {CommandA, EventA, QueryA, ResultA, ResultB} from "./__TEST/fixture";
import {Bus} from "@tmorin/ceb-messaging-core";
import sinon from "sinon";

describe("ceb-messaging-simple/InMemorySimpleBus", function () {
    let bus: Bus;
    beforeEach(function () {
        bus = new InMemorySimpleBus()
    })
    afterEach(async function () {
        await bus?.dispose()
    })
    describe("when action handler found", function () {
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
    describe("when action handler not found", function () {
        describe("when execute and forget", function () {
            it("should emit an internal event", function (done) {
                const queryA = new QueryA("test value")
                bus.on("action_handler_not_found", () => {
                    done()
                    bus.off()
                })
                bus.execute(queryA)
            })
        })
        describe("when execute and forget", function () {
            it("should return an error and emit an internal event", function (done) {
                const spyInternalListener = sinon.spy()
                const queryA = new QueryA("test value")
                bus.on("action_handler_not_found", spyInternalListener)
                bus.execute(queryA, ResultA).catch(e => {
                    assert.ok(e)
                    assert.ok(spyInternalListener.called)
                    done()
                })
            })
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
