import {
    Command,
    CommandBus,
    CommandBusNotificationMap,
    EmitterCommandBus,
    ObservableCommandBus
} from "@tmorin/ceb-messaging-core";

/**
 * The map of the internal events for commands handling.
 */
export interface IpcCommandBusNotificationMap extends CommandBusNotificationMap {
    "command_forward_failed": {
        bus: CommandBus,
        command: Command,
        error: Error,
    }
}

export interface IpcObservableCommandBus extends ObservableCommandBus {
    /**
     * Listen to an internal event.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    on<K extends keyof IpcCommandBusNotificationMap>(
        type: K,
        listener: (event: IpcCommandBusNotificationMap[K]) => any
    ): this;

    /**
     * Remove listeners.
     * @param type the type of the event
     * @param listener the listener
     * @template K the type of the internal event
     */
    off<K extends keyof IpcCommandBusNotificationMap>(
        type?: K,
        listener?: (event: IpcCommandBusNotificationMap[K]) => any
    ): this;
}

/**
 * The emitter view of an an {@link CommandBus}.
 */
export interface IpcEmitterCommandBus extends EmitterCommandBus {
    /**
     * Emit an internal event.
     * @param type the type
     * @param event the event
     * @template K the type of the internal event
     */
    emit<K extends keyof IpcCommandBusNotificationMap>(
        type: K,
        event: IpcCommandBusNotificationMap[K]
    ): void;
}
