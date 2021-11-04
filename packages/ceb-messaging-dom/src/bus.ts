import {
    AbstractBus,
    Bus,
    ExecuteOptions,
    ExecutionHandler,
    Handler,
    MessageAction,
    MessageConstructor,
    MessageEvent,
    MessageKind,
    MessageResult,
    MessageType,
    SubscribeOptions,
    Subscription,
    SubscriptionListener
} from "@tmorin/ceb-messaging-core";
import {DomAction, DomError, DomEvent, DomMessage, DomResult, DomVoidResult} from "./message";

const RESULT_LISTENERS = new WeakMap<DomBus, Set<ListenerContext>>()
const EVENT_LISTENERS = new WeakMap<DomBus, Set<ListenerContext>>()

class ListenerContext implements Subscription, Handler {

    private constructor(
        public readonly bus: DomBus,
        public readonly type: string,
        public readonly listener: Function,
        public readonly target: EventTarget,
        public readonly options?: SubscribeOptions,
    ) {
    }

    static createPersistentListener(
        bus: DomBus,
        type: string,
        listener: Function,
        options?: SubscribeOptions,
        target: EventTarget = bus.global
    ) {
        const listenerRemover = new ListenerContext(bus, type, listener, target, options)
        listenerRemover.subscribe()
        if (!EVENT_LISTENERS.has(listenerRemover.bus)) {
            EVENT_LISTENERS.set(listenerRemover.bus, new Set())
        }
        EVENT_LISTENERS.get(listenerRemover.bus)?.add(listenerRemover)
        return listenerRemover
    }

    static createResultListener(
        bus: DomBus,
        type: string,
        listener: Function,
        target: EventTarget = bus.global
    ) {
        const listenerRemover = new ListenerContext(bus, type, listener, target)
        listenerRemover.subscribe()
        if (!RESULT_LISTENERS.has(listenerRemover.bus)) {
            RESULT_LISTENERS.set(listenerRemover.bus, new Set())
        }
        RESULT_LISTENERS.get(listenerRemover.bus)?.add(listenerRemover)
        return listenerRemover
    }

    subscribe(): void {
        this.target.addEventListener(this.type, this.listener as EventListener, {
            once: this.options?.once || false
        })
    }

    unsubscribe(): void {
        this.remove()
    }

    cancel(): void {
        this.remove()
    }

    remove(): void {
        RESULT_LISTENERS.get(this.bus)?.delete(this)
        EVENT_LISTENERS.get(this.bus)?.delete(this)
        this.target.removeEventListener(
            this.type,
            this.listener as EventListener
        )
    }
}

/**
 * An implementation of a {@link Bus} based on the native DOM Event System.
 */
export class DomBus extends AbstractBus implements Bus {

    constructor(
        /**
         * The target is used to :
         * - publish events
         * - register event subscriptions
         * - register action handlers
         */
        public readonly global: EventTarget,
        /**
         * The target is used to :
         * - execute actions
         * - register action result
         */
        public readonly requester: EventTarget = global,
    ) {
        super()
    }

    async dispose() {
        await super.dispose()
        Array.from(EVENT_LISTENERS.get(this) || [])
            .concat(Array.from(RESULT_LISTENERS.get(this) || []))
            .forEach((value) => value.remove())
    }

    async execute<A extends MessageAction>(action: A, arg1?: any, arg2?: any): Promise<any> {
        if (!(action instanceof DomAction)) {
            throw new TypeError("DomBus - the action must be an instance of DomAction")
        }
        if (arg1) {
            return this.executeAndWait(action, arg1, arg2)
        }
        return this.executeAndForget(action)
    }

    handle<A extends MessageAction, R extends MessageResult>(
        ActionType: MessageType | MessageConstructor<A>,
        ResultType: MessageType | MessageConstructor<R>,
        handler: ExecutionHandler<A, R>
    ): Handler {
        const actionMessageType = DomMessage.toName(ActionType)
        const resultMessageType = DomMessage.toName(ResultType)

        const listener = async (action: A) => {
            // leave early if the message type is wrong
            if (!(action instanceof Event)) {
                throw new TypeError("DomBus - the action must be an instance of DomAction")
            }
            action.stopImmediatePropagation()
            try {
                const result = await handler(action)
                if (result instanceof Event) {
                    action.target?.dispatchEvent(result)
                } else {
                    action.target?.dispatchEvent(new DomVoidResult(resultMessageType, action))
                }
            } catch (error: any) {
                action.target?.dispatchEvent(new DomError(resultMessageType, action, error))
            }
        }

        return ListenerContext.createPersistentListener(
            this,
            actionMessageType,
            listener,
            undefined,
            this.global
        )
    }

    async publish<E extends MessageEvent>(event: E): Promise<void> {
        if (!(event instanceof DomEvent)) {
            throw new TypeError("DomBus - the event must be an instance of DomEvent")
        }
        this.global.dispatchEvent(event)
    }

    subscribe<E extends MessageEvent>(
        EventType: MessageType | MessageConstructor<E>,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription {
        const eventMessageType = DomMessage.toName(EventType)
        return ListenerContext.createPersistentListener(this, eventMessageType, listener, options)
    }

    private async executeAndWait<A extends DomAction, R extends DomResult>(
        action: A,
        ResultType: MessageType | MessageConstructor<R>,
        options?: ExecuteOptions
    ): Promise<R> {
        return new Promise((resolve, reject) => {
            const resultMessageType = DomMessage.toName(ResultType)

            const listener = (result: R) => {
                // leave early if the message type is wrong
                if (result.headers.correlationId === action.headers.messageId) {
                    listenerContext.remove()
                    clearTimeout(timeoutId);
                    if (result.kind === MessageKind.error) {
                        reject(result.body);
                    } else {
                        resolve(result);
                    }
                }
            }

            const timeout = options?.timeout || 500
            const timeoutId = setTimeout(() => {
                listenerContext.remove()
                reject(new Error(`DomBus - unable to get a result after ${timeout} ms`))
            }, timeout)

            const listenerContext = ListenerContext.createResultListener(
                this,
                resultMessageType,
                listener,
                this.requester
            )

            this.requester.dispatchEvent(action)
        })
    }

    private async executeAndForget<A extends DomAction>(action: A): Promise<void> {
        this.requester.dispatchEvent(action)
    }

}
