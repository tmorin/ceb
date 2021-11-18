import {assert} from "chai";
import sinon, {SinonSpy} from "sinon";
import {Container, ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion-core";
import {listen} from "@tmorin/ceb-elements-testing";
import {
    Bus,
    BusSymbol,
    MessageCommandHandlerSymbol,
    MessageEventListenerSymbol,
    MessageQueryHandlerSymbol,
    MessagingModule
} from "@tmorin/ceb-messaging-core";
import {DomMessage} from "./message";
import {DomModule} from "./inversion";
import {
    SimpleCommandA,
    SimpleCommandAHandler,
    SimpleCommandB,
    SimpleCommandBHandler,
    SimpleEventA,
    SimpleEventAListener,
    SimpleQueryA,
    SimpleQueryAHandler,
    SimpleResultA
} from "./__TEST/fixture";

describe("messaging/dom/inversion", function () {
    let handleCommandASpy: SinonSpy
    let simpleCommandAHandler = new SimpleCommandAHandler()
    let handleCommandBSpy: SinonSpy
    let simpleCommandBHandler = new SimpleCommandBHandler()
    let handleQueryASpy: SinonSpy
    let simpleQueryAHandler = new SimpleQueryAHandler()
    let onEventASpy: SinonSpy
    let simpleEventAListener = new SimpleEventAListener()
    before(function () {
        handleCommandASpy = sinon.spy(simpleCommandAHandler, "handle")
        handleCommandBSpy = sinon.spy(simpleCommandBHandler, "handle")
        handleQueryASpy = sinon.spy(simpleQueryAHandler, "handle")
        onEventASpy = sinon.spy(simpleEventAListener, "on")
    })
    describe("MessageCommandHandler", function () {
        let container: Container
        let bus: Bus
        beforeEach(async function () {
            container = await ContainerBuilder.get()
                .module(new DomModule())
                .module(new MessagingModule())
                .module(OnlyConfigureModule.create(async function () {
                    this.registry.registerValue(MessageCommandHandlerSymbol, simpleCommandAHandler)
                    this.registry.registerValue(MessageCommandHandlerSymbol, simpleCommandBHandler)
                }))
                .build()
                .initialize()
            bus = container.registry.resolve<Bus>(BusSymbol)
        })
        afterEach(async function () {
            await container.dispose()
        })
        it('should execute a command with only one result', async function () {
            const commandA = new SimpleCommandA("body content")
            const result = await bus.execute(commandA, SimpleResultA)
            assert.strictEqual(result.body, commandA.body)
            assert.ok(handleCommandASpy.calledOnce)
        })
        it('should execute a command with one result and one event', function (done) {
            const commandB = new SimpleCommandB("body content")
            listen(window, DomMessage.toName(SimpleEventA.name), 1, done)
            bus.execute(commandB, SimpleResultA).then(result => {
                assert.strictEqual(result.body, commandB.body)
                assert.ok(handleCommandBSpy.calledOnce)
            }).catch(done)
        })
    })
    describe("MessageQueryHandler", function () {
        let container: Container
        let bus: Bus
        beforeEach(async function () {
            container = await ContainerBuilder.get()
                .module(new DomModule())
                .module(new MessagingModule())
                .module(OnlyConfigureModule.create(async function () {
                    this.registry.registerValue(MessageQueryHandlerSymbol, simpleQueryAHandler)
                }))
                .build()
                .initialize()
            bus = container.registry.resolve<Bus>(BusSymbol)
        })
        afterEach(async function () {
            await container.dispose()
        })
        it('should execute query', async function () {
            const simpleQueryA = new SimpleQueryA("body content")
            const result = await bus.execute(simpleQueryA, SimpleResultA)
            assert.strictEqual(result.body, simpleQueryA.body)
            assert.ok(handleQueryASpy.calledOnce)
        })
    })
    describe("MessageEventListener", function () {
        let container: Container
        let bus: Bus
        beforeEach(async function () {
            container = await ContainerBuilder.get()
                .module(new DomModule())
                .module(new MessagingModule())
                .module(OnlyConfigureModule.create(async function () {
                    this.registry.registerValue(MessageEventListenerSymbol, simpleEventAListener)
                }))
                .build()
                .initialize()
            bus = container.registry.resolve<Bus>(BusSymbol)
        })
        afterEach(async function () {
            await container.dispose()
        })
        it('should listen to an event', function (done) {
            const simpleEventA = new SimpleEventA("body content")
            listen(window, DomMessage.toName(SimpleEventA), 1, done)
            bus.publish(simpleEventA).then(() => assert.ok(onEventASpy.calledOnce)).catch(done)
        })
    })
})
