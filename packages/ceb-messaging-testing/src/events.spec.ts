import assert from "assert";
import {InMemorySimpleBus} from "../../ceb-messaging-simple";
import {AbstractSimpleEvent} from "@tmorin/ceb-messaging-simple";
import {waitForEvents} from "./events";

export class EventA<B = any> extends AbstractSimpleEvent<B> {
    static "MESSAGE_TYPE" = "EventA"

    constructor(body: B) {
        super(body)
    }
}

describe("ceb-messaging-testing/events", function () {
    describe("waitForEvents", function () {
        it("should wait for 1 event", async function () {
            const bus = new InMemorySimpleBus()
            const p = waitForEvents<EventA>(bus, EventA)
            await bus.publish(new EventA("hello"))
            const events = await p
            assert.ok(events)
            assert.strictEqual(events.length, 1)
            assert.strictEqual(events[0].body, "hello")
        })
        it("should wait for 2 events", async function () {
            const bus = new InMemorySimpleBus()
            const p = waitForEvents<EventA>(bus, EventA, {occurrences: 2})
            await bus.publish(new EventA("hello"))
            await bus.publish(new EventA("world"))
            const events = await p
            assert.ok(events)
            assert.strictEqual(events.length, 2)
            assert.strictEqual(events[0].body, "hello")
            assert.strictEqual(events[1].body, "world")
        })
        it("should fails when no event published", async function () {
            const bus = new InMemorySimpleBus()
            const result = await waitForEvents<EventA>(bus, EventA, {timeout: 0})
                .then(() => undefined)
                .catch(e => e)
            assert.ok(result)
            assert.strictEqual(result.message, "unable to get expected events on time")
        })
    })
})
