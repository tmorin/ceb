import {assert} from 'chai'
import {DomMessage} from "./message";
import {DomBus} from "./bus";
import {CommandA, EventA, QueryA, ResultA, ResultB} from "./__TEST/fixture";

describe("ceb-messaging-dom/bus", function () {
    let bus: DomBus;
    beforeEach(function () {
        bus = new DomBus(window)
    })
    afterEach(async function () {
        await bus?.dispose()
    })
    describe("action", function () {
        it("should handle command", async function () {
            const commandA = new CommandA("test value")
            bus.handle(CommandA.name, ResultA, async (command) => new ResultA(command, command.body))
            const resultA = await bus.execute(commandA, ResultA)
            assert.ok(resultA)
            assert.strictEqual(resultA.body, commandA.body)
        })
        it("should handle failed command", async function () {
            const queryA = new QueryA("test value")
            bus.handle(QueryA.name, ResultA, async (query) => {
                throw new Error(query.body);
            })
            try {
                await bus.execute(queryA, ResultA)
                assert.fail()
            } catch (error: any) {
                assert.strictEqual(error.message, queryA.body)
            }
        })
        it("should handle timeout", async function () {
            const commandA = new QueryA("test value")
            bus.handle(QueryA.name, ResultA, async (command) => new ResultA(command, command.body))
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
            bus.subscribe(DomMessage.toName(EventA.name), (receivedEventA) => {
                assert.strictEqual(receivedEventA, sentEventA)
                done()
            })
            bus.publish(sentEventA)
        })
    })
})
