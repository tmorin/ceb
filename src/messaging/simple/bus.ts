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
    MessageEventType,
    MessageResult,
    SubscribeOptions,
    Subscription,
    SubscriptionListener
} from "../model";
import {toKebabCase} from "../../utilities";

class HandlerEntry<A extends AbstractSimpleAction = any, R extends AbstractSimpleResult = any> implements Handler {
    constructor(
        private readonly ActionType: MessageConstructor<A>,
        private readonly ResultType: MessageConstructor<R>,
        private readonly handler: ExecutionHandler<A, R>,
        private readonly handlers: Map<MessageConstructor<AbstractSimpleAction>, HandlerEntry>
    ) {
        this.register()
    }

    async handle(action: A): Promise<R | void> {
        return this.handler(action);
    }

    register(): void {
        this.handlers.set(this.ActionType, this)
    }

    cancel(): void {
        this.handlers.delete(this.ActionType)
    }
}

class SubscriptionEntry<E extends AbstractSimpleEvent = any> implements Subscription {
    constructor(
        private readonly EventType: MessageEventType<E>,
        public readonly listener: SubscriptionListener<E>,
        private readonly listeners: Map<string, Set<SubscriptionEntry>>,
        public readonly options?: SubscribeOptions,
        private key = typeof EventType === "string" ? EventType : toKebabCase(EventType.name)
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

/**
 * An very simple implementation of a {@link Bus}.
 */
export class InMemorySimpleBus implements Bus {

    /**
     * A global instance.
     */
    public static readonly GLOBAL: InMemorySimpleBus = new InMemorySimpleBus()

    constructor(
        private readonly handlers: Map<MessageConstructor<AbstractSimpleAction>, HandlerEntry> = new Map(),
        private readonly subscriptions: Map<string, Set<SubscriptionEntry>> = new Map()
    ) {
    }

    destroy() {
        this.handlers.forEach(handler => handler.cancel())
    }

    subscribe<E extends MessageEvent>(
        EventType: MessageEventType<E>,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription {
        return new SubscriptionEntry<E>(EventType, listener, this.subscriptions, options)
    }

    async publish<E extends MessageEvent>(event: E): Promise<void> {
        const key = toKebabCase(Object.getPrototypeOf(event).constructor.name)
        this.subscriptions.get(key)?.forEach((value) => {
            try {
                value.handle(event)
            } catch (error) {
                console.error("a subscription failed to handle the event %o", event, error)
            }
        })
    }

    handle<A extends MessageAction, R extends MessageResult>(
        ActionType: MessageConstructor<A>,
        ResultType: MessageConstructor<R>,
        handler: ExecutionHandler<A, R>
    ): Handler {
        return new HandlerEntry<A, R>(ActionType, ResultType, handler, this.handlers)
    }

    async execute<A extends MessageAction>(action: A, arg1?: any, arg2?: any): Promise<any> {
        const actionConstructor = Object.getPrototypeOf(action).constructor
        const entry = this.handlers.get(actionConstructor)
        if (!entry) {
            throw new Error(`InMemorySimpleBus - no handler found for the action ${actionConstructor.name}`)
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
    ): Promise<R | SimpleVoidResult | SimpleErrorResult> {
        return new Promise((resolve, reject) => {
            const timeout = options?.timeout || 500
            const timeoutId = setTimeout(() => reject(new SimpleErrorResult(
                new Error(`InMemorySimpleBus - unable to get a result after ${timeout} ms`))
            ), timeout)
            entry.handle(action)
                .then(value => resolve(value instanceof AbstractSimpleResult ? value : new SimpleVoidResult()))
                .catch(error => reject(new SimpleErrorResult(error)))
                .finally(() => clearTimeout(timeoutId))
        })
    }

    private async executeAndForget<A extends AbstractSimpleAction>(
        entry: HandlerEntry<A>,
        action: A
    ): Promise<void> {
        entry.handle(action).catch(error => console.error("InMemorySimpleBus - the action %o failed", error))
    }

}
