import {MessageAction, MessageConstructor, MessageEvent, MessageEventType, MessageResult} from "./message";

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
     */(event: E): void
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
     * @param Type the type of the event
     * @param listener the listener
     * @param options the options
     * @return the subscription
     * @template E the type of the event
     */
    subscribe<E extends MessageEvent>(
        Type: MessageEventType<E>,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription

    /**
     * Execute the action and wait for a result.
     * @param action the action
     * @param ResultType the expected result type
     * @param options the options
     * @return the result
     * @template A the type of the action
     * @template R the type of the result
     */
    execute<A extends MessageAction, R extends MessageResult>(
        action: A,
        ResultType: MessageConstructor<R>,
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
     * @param ResultType the type of action result
     * @param handler the handler
     * @return the handler
     * @template A the type of the action
     * @template R the type of the result
     */
    handle<M extends MessageAction, R extends MessageResult>(
        ActionType: MessageConstructor<M>,
        ResultType: MessageConstructor<R>,
        handler: ExecutionHandler<M, R>
    ): Handler

}
