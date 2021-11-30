import {Observable, ObservableGateway} from "@tmorin/ceb-messaging-core"
import {IpcEventBusNotificationMap, IpcObservableEventBus} from "./event"
import {IpcCommandBusNotificationMap, IpcObservableCommandBus} from "./command"
import {IpcObservableQueryBus, IpcQueryBusNotificationMap} from "./query"

/**
 * The observable view of a gateway merges the observable channel of all buses.
 */
export type IpcObservableGateway = IpcObservableCommandBus & IpcObservableEventBus & IpcObservableQueryBus

/**
 * The map defines the internal events of all buses.
 */
export type IpcGatewayNotificationMap =
    IpcCommandBusNotificationMap
    & IpcEventBusNotificationMap
    & IpcQueryBusNotificationMap

/**
 * Simple implementation of {@link ObservableGateway}.
 */
export class IpcGatewayObserver implements IpcObservableGateway {
    constructor(
        private readonly events: Observable,
        private readonly commands: Observable,
        private readonly queries: Observable
    ) {
    }

    on<K extends keyof IpcGatewayNotificationMap>(
        type: K,
        listener: (event: IpcGatewayNotificationMap[K]) => any
    ) {
        this.events.on(type, listener)
        this.commands.on(type, listener)
        this.queries.on(type, listener)
        return this
    }

    off<K extends keyof IpcGatewayNotificationMap>(
        type?: K,
        listener?: (event: IpcGatewayNotificationMap[K]) => any
    ) {
        this.events.off(type, listener)
        this.commands.off(type, listener)
        this.queries.off(type, listener)
        return this
    }
}
