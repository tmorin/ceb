import {MessageAction, MessageConstructor, MessageEvent, MessageResult, MessageType} from "./message";

export const BusSymbol = Symbol.for('ceb/messaging/Bus');

/**
 * The options of the subscriptions.
 */
export interface SubscribeOptions {
    /**
     * The subscription will terminate right after the first handled event.
     */
    once?: boolean
}

/**
 * A subscription listener.
 * @template E the type of the event
 */
export interface SubscriptionListener<E extends MessageEvent> {
    /**
     * Handle a message.
     * @param event the event
     */
    (event: E): void
}

/**
 * A subscription.
 */
export interface Subscription {
    /**
     * Cancel the subscription.
     */
    unsubscribe(): void
}

/**
 * A handler.
 */
export interface Handler {
    /**
     * Cancel the handler.
     */
    cancel(): void
}

/**
 * The parameter of the execution.
 */
export interface ExecuteOptions {
    /**
     * The maximum time in milliseconds to wait for a result.
     */
    timeout?: number
}

/**
 * An execution handler.
 * @template M the type of the action
 * @template R the type of the result
 */
export interface ExecutionHandler<M extends MessageAction, R extends MessageResult> {
    (message: M): Promise<R | void> | void
}

/**
 * Listener of Bus's events.
 */
export interface InternalEventListener {
    (...args: any[]): void
}

/**
 * The map of the internal events.
 */
export interface InternalBusEventMap {
    "action_handler_not_found": {
        bus: Bus,
        action: MessageAction,
        error: Error,
    }
    "action_handler_failed": {
        bus: Bus,
        action: MessageAction,
        error: Error,
    }
    "event_listener_failed": {
        bus: Bus,
        event: MessageEvent,
        error: Error,
    }
    "disposed": {
        bus: Bus
    }
}

/**
 * A bus provides services to dispatch action to handlers and publish events to subscribers.
 */
export interface Bus {

    /**
     * Publish an event to subscribers.
     * @param event the event
     * @template E the of the event
     */
    publish<E extends MessageEvent>(
        event: E
    ): void

    /**
     * Register a subscriber.
     * The listener will be invoked each time an event of the provided type is published.
     * @param EventType the type of the message
     * @param listener the listener
     * @param options the options
     * @return the subscription
     * @template E the type of the event
     */
    subscribe<E extends MessageEvent>(
        EventType: MessageType | MessageConstructor<E>,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription

    /**
     * Execute the action and wait for a result.
     * @param action the action
     * @param ResultType the type of the result
     * @param options the options
     * @return the result
     * @template A the type of the action
     * @template R the type of the result
     */
    execute<A extends MessageAction, R extends MessageResult>(
        action: A,
        ResultType: MessageType | MessageConstructor<R>,
        options?: ExecuteOptions
    ): Promise<R>

    /**
     * Execute the action and release once sent.
     * @param action the action
     * @template A the type of the action
     */
    execute<A extends MessageAction>(
        action: A,
    ): void

    /**
     * Register an action handler.
     * The handler will be invoked each time an action of the provided type is published.
     * An action can only be handled by one handler.
     * @param ActionType the type of the action
     * @param ResultType the type of the action result
     * @param handler the handler
     * @return the handler
     * @template A the type of the action
     * @template R the type of the result
     */
    handle<A extends MessageAction, R extends MessageResult>(
        ActionType: MessageType | MessageConstructor<A>,
        ResultType: MessageType | MessageConstructor<R>,
        handler: ExecutionHandler<A, R>
    ): Handler

    /**
     * Add a listener to an internal event.
     * @param type the type of the event
     * @param listener the listener
     */
    on<K extends keyof InternalBusEventMap>(type: K, listener: (event: InternalBusEventMap[K]) => any): this

    /**
     * Emit an internal event.
     * @param type the type of the event
     * @param event the event
     */
    emit<K extends keyof InternalBusEventMap>(type: K, event: InternalBusEventMap[K]): void

    /**
     * Remove a listener to an internal event.
     *
     *  However:
     * - When `type` and `listener` are undefined then all listeners are removed.
     * - When `listener` is undefined then all listeners of the given `type` are removed.
     *
     * @param type the type of the event
     * @param listener the listener
     */
    off<K extends keyof InternalBusEventMap>(type?: K, listener?: (event: InternalBusEventMap[K]) => any): this

    /**
     * Release all stateful artifacts.
     */
    dispose(): Promise<void>

}

/**
 * An beginning of implementation of {@link Bus} handling the listeners of the internal  events.
 */
export abstract class AbstractBus implements Bus {
    protected constructor(
        /**
         * The listeners of the internal events.
         */
        private readonly listeners: Map<string | symbol, Array<InternalEventListener>> = new Map(),
    ) {
    }

    abstract execute<A extends MessageAction, R extends MessageResult>(action: A, ResultType: MessageConstructor<R>, options?: ExecuteOptions): Promise<R>

    abstract execute<A extends MessageAction>(action: A): void

    abstract handle<M extends MessageAction, R extends MessageResult>(actionType: MessageType, ResultType: MessageConstructor<R>, handler: ExecutionHandler<M, R>): Handler

    abstract publish<E extends MessageEvent>(event: E): void

    abstract subscribe<E extends MessageEvent>(eventType: MessageType, listener: SubscriptionListener<E>, options?: SubscribeOptions): Subscription

    async dispose() {
        this.emit("disposed", {bus: this})
        this.off()
    }

    emit<K extends keyof InternalBusEventMap>(type: K, event: InternalBusEventMap[K]): void {
        this.listeners.get(type)?.forEach(listener => {
            try {
                listener.call(undefined, event)
            } catch (error) {
                console.warn(`InMemorySimpleBus - listener for the internal event ${type.toString()} failed`, error)
            }
        })
    }

    on<K extends keyof InternalBusEventMap>(type: K, listener: (event: InternalBusEventMap[K]) => any): this {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, [])
        }
        this.listeners.get(type)?.push(listener)
        return this
    }

    off<K extends keyof InternalBusEventMap>(type?: K, listener?: (event: InternalBusEventMap[K]) => any): this {
        if (type && listener) {
            const index = this.listeners.get(type)?.indexOf(listener)
            if (typeof index === "number" && index > -1) {
                this.listeners.get(type)?.splice(index, 1)
            }
        } else if (type) {
            this.listeners.delete(type)
        } else {
            this.listeners.clear()
        }
        return this
    }

}
