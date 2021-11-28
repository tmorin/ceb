import {EventBus, EventBusNotificationMap, ObservableEventBus} from "./event";
import {CommandBus, CommandBusNotificationMap, ObservableCommandBus} from "./command";
import {ObservableQueryBus, QueryBus, QueryBusNotificationMap} from "./query";
import {Disposable} from "./common";
import {Emitter, Observable, ObservedEventListener} from "./observable";

/**
 * The observable view of a gateway merges the observable channel of all buses.
 */
export type ObservableGateway = ObservableEventBus &
    ObservableCommandBus &
    ObservableQueryBus;

/**
 * The symbol used to register {@link Gateway}.
 */
export const GatewaySymbol = Symbol.for("ceb/inversion/Gateway")

/**
 * A gateway provides the buses: Command, Query and Event.
 */
export interface Gateway<E extends EventBus = EventBus,
    C extends CommandBus = CommandBus,
    Q extends QueryBus = QueryBus,
    O extends ObservableGateway = ObservableGateway> extends Disposable {
    /**
     * The event bus.
     */
    readonly events: E;
    /**
     * The command bus.
     */
    readonly commands: C;
    /**
     * The query.
     */
    readonly queries: Q;
    /**
     * The observable view of the gateway.
     */
    readonly observer: O;
}

/**
 * The map defines the internal events of all buses.
 */
export type GatewayNotificationMap = EventBusNotificationMap &
    CommandBusNotificationMap &
    QueryBusNotificationMap

/**
 * The symbol used to register {@link GatewayEmitter}.
 */
export const GatewayEmitterSymbol = Symbol.for("ceb/inversion/GatewayEmitter")

/**
 * A basic implementation of {@link Observable} and {@link Emitter}.
 */
export class GatewayEmitter implements Emitter {
    constructor(
        private readonly listeners = new Map<string, Set<ObservedEventListener>>()
    ) {
    }

    emit(type: string, event: any): void {
        this.listeners.get(type)?.forEach((listener) => {
            Promise.resolve((async () => listener(event))()).catch((error) =>
                console.warn("an observed event listener failed", error)
            )
        })
    }

    on(type: string, listener: ObservedEventListener): this {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set())
        }
        this.listeners.get(type)?.add(listener)
        return this
    }

    off(type?: string, listener?: ObservedEventListener): this {
        if (type && listener) {
            this.listeners.get(type)?.delete(listener)
        } else if (type) {
            this.listeners.delete(type)
        } else {
            this.listeners.clear()
        }
        return this
    }
}

/**
 * The symbol used to register {@link GatewayObserver}.
 */
export const GatewayObserverSymbol = Symbol.for("ceb/inversion/GatewayObserver")

/**
 * Simple implementation of {@link ObservableGateway}.
 */
export class GatewayObserver implements ObservableGateway {
    constructor(
        private readonly events: Observable,
        private readonly commands: Observable,
        private readonly queries: Observable
    ) {
    }

    on<K extends keyof GatewayNotificationMap>(
        type: K,
        listener: (event: GatewayNotificationMap[K]) => any
    ) {
        this.events.on(type, listener)
        this.commands.on(type, listener)
        this.queries.on(type, listener)
        return this
    }

    off<K extends keyof GatewayNotificationMap>(
        type?: K,
        listener?: (event: GatewayNotificationMap[K]) => any
    ) {
        this.events.off(type, listener)
        this.commands.off(type, listener)
        this.queries.off(type, listener)
        return this
    }
}
