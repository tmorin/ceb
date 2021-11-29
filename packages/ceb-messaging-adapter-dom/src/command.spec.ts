import {assert} from "chai";
import {SimpleGateway} from "@tmorin/ceb-messaging-simple";
import {Command, Gateway, MessageBuilder, Result} from "@tmorin/ceb-messaging-core";
import {CommandForwarder} from "./command";
import {DomCommand, DomResult} from "./message";

describe("CommandForwarder", function () {
    let div: HTMLDivElement
    let gateway: Gateway
    let adapter: CommandForwarder
    beforeEach(async function () {
        div = document.body.appendChild(document.createElement("div"))
        gateway = SimpleGateway.create()
        adapter = new CommandForwarder(window, gateway)
        await adapter.configure()
    })
    afterEach(async function () {
        await adapter.dispose()
        await gateway.dispose()
    })
    describe("#executeAndForget", function () {
        it("should forward a command but forget a result", function (done) {
            gateway.commands.handle<Command<string>>("CommandA", (command) => {
                assert.property(command, "body", "hello")
                done()
            })
            const event = new DomCommand(MessageBuilder.command("CommandA").body("hello").build(), false)
            div.dispatchEvent(event)
        })
    })
    describe("#execute", function () {
        it("should handle results", function (done) {
            gateway.commands.handle<Command<string>, Result<string>>("CommandB", (command) => {
                const result = MessageBuilder.result(command).body(command.body).build()
                return {result}
            })
            div.addEventListener(DomResult.CUSTOM_EVENT_TYPE, (event) => {
                assert.nestedProperty(event, "detail.body", "hello")
                done()
            }, {once: true})
            const event = new DomCommand(MessageBuilder.command("CommandB").body("hello").build())
            div.dispatchEvent(event)
        })
        it("should handle errors", function (done) {
            gateway.commands.handle<Command<string>, Result<string>>("CommandC", async () => {
                throw new Error("an error")
            })
            div.addEventListener(DomResult.CUSTOM_EVENT_TYPE, (event) => {
                assert.nestedProperty(event, "detail.body.message", "an error")
                done()
            }, {once: true})
            const event = new DomCommand(MessageBuilder.command("CommandC").body("hello").build())
            div.dispatchEvent(event)
        })
    })
})
