import {assert} from "chai";
import sinon from "sinon";
import {Container, ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion";
import {
    Bus,
    BusSymbol,
    MessageCommandHandlerSymbol,
    MessageEventListenerSymbol,
    MessagingModule
} from "@tmorin/ceb-messaging-core";
import {SimpleModule} from "./inversion";
import {CommandWithMessageType, CommandWithMessageTypeHandler, EventA, EventAListener, ResultA} from "./__TEST/fixture";

describe("messaging/simple/inversion", function () {
    let eventListener: EventAListener = new EventAListener()
    let listenerSpy = sinon.spy(eventListener, "on")

    let commandHandler: CommandWithMessageTypeHandler = new CommandWithMessageTypeHandler()
    let handlerSpy = sinon.spy(commandHandler, "handle")

    let container: Container
    let bus: Bus
    beforeEach(async function () {
        container = await ContainerBuilder.get()
            .module(new SimpleModule())
            .module(new MessagingModule())
            .module(OnlyConfigureModule.create(async function () {
                this.registry.registerValue(MessageEventListenerSymbol, eventListener)
                this.registry.registerValue(MessageCommandHandlerSymbol, commandHandler)
            }))
            .build()
            .initialize()
        bus = container.registry.resolve<Bus>(BusSymbol)
    })
    afterEach(async function () {
        await container.dispose()
    })
    it('should listen to an event', async function () {
        const simpleEventA = new EventA("body content")
        await bus.publish(simpleEventA)
        assert.ok(listenerSpy.calledOnce)
    })
    it('should handle command', async function () {
        const command = new CommandWithMessageType("body content")
        const result = await bus.execute(command, ResultA)
        assert.ok(handlerSpy.calledOnce)
        assert.ok(result)
        assert.equal(result.body, command.body)
    })
})
