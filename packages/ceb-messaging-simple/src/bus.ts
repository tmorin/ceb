import {
    AbstractSimpleAction,
    AbstractSimpleEvent,
    AbstractSimpleResult,
    SimpleErrorResult,
    SimpleVoidResult
} from "./message";
import {
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
import {AbstractBus} from "@tmorin/ceb-messaging-core/src";

class HandlerEntry<A extends AbstractSimpleAction = any, R extends AbstractSimpleResult = any> implements Handler {
    constructor(
        private readonly actionType: MessageType,
        private readonly ResultType: MessageConstructor<R>,
        private readonly handler: ExecutionHandler<A, R>,
        private readonly handlers: Map<MessageType, HandlerEntry>
    ) {
        this.register()
    }

    async handle(action: A): Promise<R | void> {
        return this.handler(action);
    }

    register(): void {
        this.handlers.set(this.actionType, this)
    }

    cancel(): void {
        this.handlers.delete(this.actionType)
    }
}

class SubscriptionEntry<E extends AbstractSimpleEvent = any> implements Subscription {
    constructor(
        private readonly eventType: MessageType,
        public readonly listener: SubscriptionListener<E>,
        private readonly listeners: Map<string, Set<SubscriptionEntry>>,
        public readonly options?: SubscribeOptions,
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
        if (!this.listeners.has(this.eventType)) {
            this.listeners.set(this.eventType, new Set())
        }
        if (!this.listeners.get(this.eventType)?.has(this)) {
            this.listeners.get(this.eventType)?.add(this)
        }
    }

    unsubscribe(): void {
        this.listeners.get(this.eventType)?.delete(this)
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
        EventType: MessageType,
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
        actionType: MessageType,
        ResultType: MessageConstructor<R>,
        handler: ExecutionHandler<A, R>
    ): Handler {
        return new HandlerEntry<A, R>(actionType, ResultType, handler, this.handlers)
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
