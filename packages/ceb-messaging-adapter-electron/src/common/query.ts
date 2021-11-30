import {EmittableQueryBus, ObservableQueryBus, QueryBus, QueryBusNotificationMap} from "@tmorin/ceb-messaging-core"

/**
 * The map of the internal events for queries handling.
 */
export interface IpcQueryBusNotificationMap extends QueryBusNotificationMap {}

export interface IpcObservableQueryBus extends ObservableQueryBus {
  /**
   * Listen to an internal event.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  on<K extends keyof IpcQueryBusNotificationMap>(type: K, listener: (event: IpcQueryBusNotificationMap[K]) => any): this

  /**
   * Remove listeners.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  off<K extends keyof IpcQueryBusNotificationMap>(
    type?: K,
    listener?: (event: IpcQueryBusNotificationMap[K]) => any
  ): this
}

/**
 * The emitter view of an an {@link QueryBus}.
 */
export interface IpcEmitterQueryBus extends EmittableQueryBus {
  /**
   * Emit an internal event.
   * @param type the type
   * @param event the event
   * @template K the type of the internal event
   */
  emit<K extends keyof IpcQueryBusNotificationMap>(type: K, event: IpcQueryBusNotificationMap[K]): void
}
