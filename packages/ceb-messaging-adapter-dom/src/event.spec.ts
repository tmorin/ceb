import {assert} from "chai"
import {SimpleGateway} from "@tmorin/ceb-messaging-simple"
import {EventForwarder} from "./event"
import {Gateway, MessageBuilder} from "@tmorin/ceb-messaging-core"
import {DomEvent} from "./message"

describe("EventForwarder", function () {
    let div: HTMLDivElement
    let gateway: Gateway
    let adapter: EventForwarder
    beforeEach(async function () {
        div = document.body.appendChild(document.createElement("div"))
        gateway = SimpleGateway.create()
        adapter = new EventForwarder(window, gateway)
        await adapter.configure()
    })
    afterEach(async function () {
        await adapter.dispose()
        await gateway.dispose()
    })
    describe("#publish", function () {
        it("should forward an event", function (done) {
            gateway.events.subscribe("EventA", (event) => {
                assert.property(event, "body", "hello")
                done()
            }, {once: true})
            const event = new DomEvent(MessageBuilder.event("EventA").body("hello").build())
            div.dispatchEvent(event)
        })
    })
})
