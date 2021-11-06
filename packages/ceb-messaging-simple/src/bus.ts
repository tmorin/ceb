import {
    AbstractSimpleAction,
    AbstractSimpleEvent,
    AbstractSimpleResult,
    SimpleErrorResult,
    SimpleVoidResult
} from "./message";
import {
    AbstractBus,
    Bus,
    ExecuteOptions,
    ExecutionHandler,
    Handler,
    MessageAction,
    MessageConstructor,
    MessageEvent,
    MessageResult,
    MessageType,
    SubscribeOptions,
    Subscription,
    SubscriptionListener
} from "@tmorin/ceb-messaging-core";

class HandlerEntry<A extends AbstractSimpleAction = any, R extends AbstractSimpleResult = any> implements Handler {
    constructor(
        private readonly ActionType: MessageType | MessageConstructor<A>,
        private readonly handler: ExecutionHandler<A, R>,
        private readonly handlers: Map<MessageType, HandlerEntry>,
        private readonly key = typeof ActionType === "string"
            ? ActionType
            : ActionType["MESSAGE_TYPE"] || ActionType.prototype["MESSAGE_TYPE"] || ActionType.name
    ) {
        this.register()
    }

    async handle(action: A): Promise<R | void> {
        return this.handler(action);
    }

    register(): void {
        this.handlers.set(this.key, this)
    }

    cancel(): void {
        this.handlers.delete(this.key)
    }
}

class SubscriptionEntry<E extends AbstractSimpleEvent = any> implements Subscription {
    constructor(
        private readonly EventType: MessageType | MessageConstructor<E>,
        public readonly listener: SubscriptionListener<E>,
        private readonly listeners: Map<string, Set<SubscriptionEntry>>,
        public readonly options?: SubscribeOptions,
        private readonly key = typeof EventType === "string"
            ? EventType
            : EventType["MESSAGE_TYPE"] || EventType.prototype["MESSAGE_TYPE"] || EventType.name
    ) {
        this.register()
    }

    handle(event: E) {
        if (this.options?.once) {
            this.unsubscribe()
        }
        this.listener(event)
    }

    register(): void {
        if (!this.listeners.has(this.key)) {
            this.listeners.set(this.key, new Set())
        }
        if (!this.listeners.get(this.key)?.has(this)) {
            this.listeners.get(this.key)?.add(this)
        }
    }

    unsubscribe(): void {
        this.listeners.get(this.key)?.delete(this)
    }
}

function getGlobalBus() {
    if (typeof window !== "undefined") {
        // @ts-ignore
        if (!window.CEB_GLOBAL_SIMPLE_BUS) {
            // @ts-ignore
            window.CEB_GLOBAL_SIMPLE_BUS = new InMemorySimpleBus()
        }
        // @ts-ignore
        return window.CEB_GLOBAL_SIMPLE_BUS
    } else if (typeof global !== "undefined") {
        // @ts-ignore
        if (!global.CEB_GLOBAL_SIMPLE_BUS) {
            // @ts-ignore
            global.CEB_GLOBAL_SIMPLE_BUS = new InMemorySimpleBus()
        }
        // @ts-ignore
        return global.CEB_GLOBAL_SIMPLE_BUS
    }
    return new InMemorySimpleBus()
}

/**
 * The symbol used to register {@link InMemorySimpleBus}.
 */
export const InMemorySimpleBusSymbol = Symbol.for("ceb/inversion/InMemorySimpleBus")

/**
 * An very simple implementation of a {@link Bus}.
 */
export class InMemorySimpleBus extends AbstractBus implements Bus {

    /**
     * A global instance.
     */
    public static readonly GLOBAL: InMemorySimpleBus = getGlobalBus()

    constructor(
        /**
         * @ignore
         */
        private readonly handlers: Map<MessageType, HandlerEntry> = new Map(),
        /**
         * @ignore
         */
        private readonly subscriptions: Map<string, Set<SubscriptionEntry>> = new Map(),
    ) {
        super()
    }

    async dispose(): Promise<void> {
        await super.dispose();
        this.handlers.forEach(handler => handler.cancel())
        this.handlers.clear()
        this.subscriptions.forEach(entries => entries.forEach(entry => entry.unsubscribe()))
        this.subscriptions.clear()
    }

    subscribe<E extends MessageEvent>(
        EventType: MessageType | MessageConstructor<E>,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription {
        return new SubscriptionEntry<E>(EventType, listener, this.subscriptions, options)
    }

    async publish<E extends MessageEvent>(event: E): Promise<void> {
        this.subscriptions.get(event.headers.messageType)?.forEach((value) => {
            try {
                value.handle(event)
            } catch (error: any) {
                this.emit("error", error)
            }
        })
    }

    handle<A extends MessageAction, R extends MessageResult>(
        ActionType: MessageType | MessageConstructor<A>,
        ResultType: MessageType | MessageConstructor<R>,
        handler: ExecutionHandler<A, R>
    ): Handler {
        return new HandlerEntry<A, R>(ActionType, handler, this.handlers)
    }

    async execute<A extends MessageAction>(action: A, arg1?: any, arg2?: any): Promise<any> {
        const entry = this.handlers.get(action.headers.messageType)
        if (!entry) {
            throw new Error(`InMemorySimpleBus - no handler found for the action ${action.headers.messageType}`)
        }
        if (arg1) {
            return this.executeAndWait(entry, action, arg2)
        }
        return this.executeAndForget(entry, action)
    }

    private async executeAndWait<A extends AbstractSimpleAction, R extends AbstractSimpleResult>(
        entry: HandlerEntry<A, R>,
        action: A,
        options?: ExecuteOptions
    ): Promise<R | SimpleVoidResult> {
        return new Promise((resolve, reject) => {
            const timeout = options?.timeout || 500
            const timeoutId = setTimeout(() => reject(new Error(
                `InMemorySimpleBus - unable to get a result after ${timeout} ms`
            )), timeout)
            entry.handle(action)
                .then(value => resolve(value instanceof AbstractSimpleResult ? value : new SimpleVoidResult()))
                .catch(error => resolve(new SimpleErrorResult(error)))
                .finally(() => clearTimeout(timeoutId))
        })
    }

    private async executeAndForget<A extends AbstractSimpleAction>(
        entry: HandlerEntry<A>,
        action: A
    ): Promise<void> {
        entry.handle(action).catch(error => this.emit("error", error))
    }

}
