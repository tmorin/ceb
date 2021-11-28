import {Disposable, Removable} from "./common";
import {Message, MessageHeaders} from "./message";
import {Emitter, Observable} from "./observable";

/**
 * The kind of an event message.
 */
export type EventKind = "event";

/**
 * An event describes something which happen in the past.
 *
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface Event<B = any, H extends MessageHeaders = MessageHeaders> extends Message<B, H> {
    /**
     * The kind the event message.
     */
    kind: EventKind;
}

/**
 * The listener of an {@link Event}.
 *
 * @template E the type of the event
 */
export interface EventListener<E extends Event = Event> {
    /**
     * @param event the event
     */
    (event: E): any;
}

/**
 * The options to subscribe to an event.
 */
export interface SubscribeOptions {
    /**
     * When {true}, the subscripion will be removed once the first reception.
     */
    once: boolean;
}

/**
 * The symbol used to register {@link EventBus}.
 */
export const EventBusSymbol = Symbol.for("ceb/inversion/EventBus")

/**
 * An event bus is a Publish-Subscribe Channel transferring {@link Event}.
 */
export interface EventBus extends Disposable {
    /**
     * Publish events on the bus.
     * @param events the events
     *
     * @template E the type of the event
     */
    publish<E extends Event = Event>(...events: Array<E>): void;

    /**
     * Subscribe to an event.
     * @param eventType the type of the event
     * @param listener the listener
     * @param options the options
     *
     * @template E the type of the event
     */
    subscribe<E extends Event = Event>(
        eventType: string,
        listener: EventListener<E>,
        options?: Partial<SubscribeOptions>
    ): Removable;
}

/**
 * The map defines the internal events of an {@link EventBus}.
 */
export type EventBusNotificationMap = {
    event_listener_failed: {
        bus: EventBus;
        event: Event;
        error: Error;
    };
    disposed: {
        bus: EventBus;
    };
};

/**
 * The observable view of an an {@link EventBus}.
 */
export interface ObservableEventBus extends Observable {
    /**
     * Listen to an internal event.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    on<K extends keyof EventBusNotificationMap>(
        type: K,
        listener: (event: EventBusNotificationMap[K]) => any
    ): this;

    /**
     * Remove listeners.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    off<K extends keyof EventBusNotificationMap>(
        type?: K,
        listener?: (event: EventBusNotificationMap[K]) => any
    ): this;
}

/**
 * The emitter view of an an {@link EventBus}.
 */
export interface EmitterEventBus extends Emitter {
    /**
     * Emit an internal event.
     * @param type the type
     * @param event the event
     * @template K the type of the internal event
     */
    emit<K extends keyof EventBusNotificationMap>(
        type: K,
        event: EventBusNotificationMap[K]
    ): void;
}
