import {assert} from "chai";
import {Container, ContainerBuilder, OnlyConfigureModule} from "../../../src/inversion";
import {
    AbstractSimpleEvent,
    Bus,
    BusSymbol,
    MessageEventListener,
    MessageEventListenerSymbol,
    MessagingModule,
    SimpleModule
} from "../../../src/messaging";
import sinon from "sinon";

class SimpleEventA extends AbstractSimpleEvent<string> {
    constructor(body: string) {
        super(body)
    }
}

class SimpleEventAListener implements MessageEventListener<SimpleEventA> {
    readonly EventType = SimpleEventA

    async on(event: SimpleEventA): Promise<void> {
    }
}

describe("messaging/simple/inversion", function () {
    let simpleEventAListener: SimpleEventAListener = new SimpleEventAListener()
    let onEventASpy = sinon.spy(simpleEventAListener, "on")
    let container: Container
    let bus: Bus
    beforeEach(async function () {
        container = await ContainerBuilder.get()
            .module(new SimpleModule())
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
    it('should listen to an event', async function () {
        const simpleEventA = new SimpleEventA("body content")
        await bus.publish(simpleEventA)
        assert.ok(onEventASpy.calledOnce)
    })
})
