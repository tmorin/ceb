import {assert} from "chai";
import {Container, ContainerBuilder, OnlyConfigureModule} from "../../../src/inversion";
import {
    Bus,
    BusSymbol,
    DomCommand,
    DomEvent,
    DomModule,
    DomQuery,
    DomResult,
    MessageAction,
    MessageCommandHandler,
    MessageCommandHandlerSymbol,
    MessageEvent,
    MessageEventListener,
    MessageEventListenerSymbol,
    MessageQueryHandler,
    MessageQueryHandlerSymbol,
    MessagingModule
} from "../../../src/messaging";
import sinon, {SinonSpy} from "sinon";
import {listen} from "../../helpers";
import {toKebabCase} from "../../../src/utilities";

class SimpleCommandA extends DomCommand<string> {
    constructor(
        body: string
    ) {
        super(SimpleCommandA, body)
    }
}

class SimpleCommandB extends DomCommand<string> {
    constructor(
        body: string
    ) {
        super(SimpleCommandB, body)
    }
}

class SimpleQueryA extends DomQuery<string> {
    constructor(
        body: string
    ) {
        super(SimpleQueryA, body)
    }
}

class SimpleResultA extends DomResult<string> {
    constructor(
        body: string,
        action: MessageAction
    ) {
        super(SimpleResultA, action, body)
    }
}

class SimpleEventA extends DomEvent<string> {
    constructor(
        body: string
    ) {
        super(SimpleEventA, body)
    }
}

class SimpleCommandAHandler implements MessageCommandHandler<SimpleCommandA, SimpleResultA> {
    readonly CommandType = SimpleCommandA
    readonly ResultType = SimpleResultA

    async handle(command: SimpleCommandA): Promise<[SimpleResultA, Array<MessageEvent>] | SimpleResultA> {
        return new SimpleResultA(command.body, command)
    }
}

class SimpleCommandBHandler implements MessageCommandHandler<SimpleCommandB, SimpleResultA> {
    readonly CommandType = SimpleCommandB
    readonly ResultType = SimpleResultA

    async handle(command: SimpleCommandB): Promise<[SimpleResultA, Array<MessageEvent>] | SimpleResultA> {
        return [new SimpleResultA(command.body, command), [new SimpleEventA(command.body)]]
    }
}

class SimpleQueryAHandler implements MessageQueryHandler<SimpleQueryA, SimpleResultA> {
    readonly QueryType = SimpleQueryA
    readonly ResultType = SimpleResultA

    async handle(query: SimpleQueryA): Promise<SimpleResultA> {
        return new SimpleResultA(query.body, query)
    }
}

class SimpleEventAListener implements MessageEventListener<SimpleEventA> {
    readonly EventType = SimpleEventA

    async on(event: SimpleEventA): Promise<void> {
    }
}

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
            listen(window, toKebabCase(SimpleEventA.name), 1, done)
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
            listen(window, "simple-event-a", 1, done)
            bus.publish(simpleEventA).then(() => assert.ok(onEventASpy.calledOnce)).catch(done)
        })
    })
})
