import {
    EmittableEventBus,
    Event,
    EventBus,
    EventBusNotificationMap,
    ObservableEventBus
} from "@tmorin/ceb-messaging-core"

/**
 * The map of the internal events for events handling.
 */
export interface IpcEventBusNotificationMap extends EventBusNotificationMap {
    "event_forward_failed": {
        bus: EventBus,
        event: Event,
        error: Error,
    }
}

export interface IpcObservableEventBus extends ObservableEventBus {
    /**
     * Listen to an internal event.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    on<K extends keyof IpcEventBusNotificationMap>(
        type: K,
        listener: (event: IpcEventBusNotificationMap[K]) => any
    ): this

    /**
     * Remove listeners.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    off<K extends keyof IpcEventBusNotificationMap>(
        type?: K,
        listener?: (event: IpcEventBusNotificationMap[K]) => any
    ): this
}

/**
 * The emitter view of an an {@link EventBus}.
 */
export interface IpcEmitterEventBus extends EmittableEventBus {
    /**
     * Emit an internal event.
     * @param type the type
     * @param event the event
     * @template K the type of the internal event
     */
    emit<K extends keyof IpcEventBusNotificationMap>(
        type: K,
        event: IpcEventBusNotificationMap[K]
    ): void
}
