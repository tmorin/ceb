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
export interface BusEventListener {
    (...args: any[]): void
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
    ): Promise<void>

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
    ): Promise<void>

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
     * Listen to the `error` event.
     * @param event the event name
     * @param listener the listener with the `Error` as argument
     */
    on(event: "error", listener: (error: Error) => void): this

    /**
     * Listen to the `dispose` event.
     * @param event the event name
     * @param listener the listener
     */
    on(event: "dispose", listener: () => void): this

    /**
     * Add a listener which listens to the `error` event.
     * @param event the event name
     * @param listener the listener
     */
    on(event: string | symbol, listener: BusEventListener): this

    /**
     * Remove all listeners.
     */
    off(): this

    /**
     * Remove all listeners matching a given event name.
     * @param event the event name
     */
    off(event: string | symbol): this

    /**
     * Remove the matching event name and listener
     * @param event the event name
     * @param listener the listener
     */
    off(event: string | symbol, listener: BusEventListener): this

    /**
     * Emit the `error` event.
     * @param event the event name
     * @param err the `Error`
     */
    emit(event: "error", err: Error): void

    /**
     * Emit the `dispose` event.
     * @param event the event name
     */
    emit(event: "dispose"): void

    /**
     * Emit an event.
     * @param event the event name
     * @param args the arguments
     */
    emit(event: string | symbol, ...args: any[]): void

    /**
     * Release all stateful artifacts.
     */
    dispose(): Promise<void>

}

/**
 * An beginning of implementation of {@link Bus} handling the listeners of the internal bus events.
 */
export abstract class AbstractBus implements Bus {
    protected constructor(
        /**
         * The listeners of the internal bus events.
         */
        private readonly listeners: Map<string | symbol, Array<BusEventListener>> = new Map(),
    ) {
    }

    abstract execute<A extends MessageAction, R extends MessageResult>(action: A, ResultType: MessageConstructor<R>, options?: ExecuteOptions): Promise<R>

    abstract execute<A extends MessageAction>(action: A): Promise<void>

    abstract handle<M extends MessageAction, R extends MessageResult>(actionType: MessageType, ResultType: MessageConstructor<R>, handler: ExecutionHandler<M, R>): Handler

    abstract publish<E extends MessageEvent>(event: E): Promise<void>

    abstract subscribe<E extends MessageEvent>(eventType: MessageType, listener: SubscriptionListener<E>, options?: SubscribeOptions): Subscription

    async dispose() {
        this.emit("dispose")
        this.off()
    }

    emit(event: string | symbol, ...args: any[]): void {
        this.listeners.get(event)?.forEach(listener => {
            try {
                listener.call(undefined, args)
            } catch (error) {
                console.warn(`InMemorySimpleBus - listener for the bus event ${event.toString()} failed`, error)
            }
        })
    }

    on(event: string | symbol, listener: BusEventListener): this {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event)?.push(listener)
        return this
    }

    off(event?: string | symbol, listener?: BusEventListener): this {
        if (event && listener) {
            const index = this.listeners.get(event)?.indexOf(listener)
            if (typeof index === "number" && index > -1) {
                this.listeners.get(event)?.splice(index, 1)
            }
        } else if (event) {
            this.listeners.delete(event)
        } else {
            this.listeners.clear()
        }
        return this
    }

}
