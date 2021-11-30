import { EmittableEventBus, EventBus, EventBusNotificationMap, ObservableEventBus } from "./event"
import { CommandBus, CommandBusNotificationMap, EmittableCommandBus, ObservableCommandBus } from "./command"
import { EmittableQueryBus, ObservableQueryBus, QueryBus, QueryBusNotificationMap } from "./query"
import { Disposable } from "./common"
import { ObservedEventListener } from "./observable"

/**
 * The observable view of a gateway merges the observable channel of all buses.
 */
export type ObservableGateway = ObservableEventBus & ObservableCommandBus & ObservableQueryBus

/**
 * The observable view of a gateway merges the observable channel of all buses.
 */
export type EmittableGateway = EmittableEventBus & EmittableCommandBus & EmittableQueryBus

/**
 * The symbol used to register {@link Gateway}.
 */
export const GatewaySymbol = Symbol.for("ceb/inversion/Gateway")

/**
 * The gateway is a low level artifact exposing the messaging buses.
 */
export interface Gateway<
  E extends EventBus = EventBus,
  C extends CommandBus = CommandBus,
  Q extends QueryBus = QueryBus,
  O extends ObservableGateway = ObservableGateway
> extends Disposable {
  /**
   * The event bus.
   */
  readonly events: E
  /**
   * The command bus.
   */
  readonly commands: C
  /**
   * The query.
   */
  readonly queries: Q
  /**
   * The observable view of the gateway.
   */
  readonly observer: O
}

/**
 * The map defines the internal events of all buses.
 */
export type GatewayNotificationMap = EventBusNotificationMap & CommandBusNotificationMap & QueryBusNotificationMap

/**
 * The symbol used to register {@link ObservableGateway}.
 */
export const GatewayObserverSymbol = Symbol.for("ceb/inversion/GatewayObserver")

/**
 * The symbol used to register {@link EmittableGateway}.
 */
export const GatewayEmitterSymbol = Symbol.for("ceb/inversion/GatewayEmitter")

/**
 * A basic implementation of {@link Observable} and {@link Emitter}.
 */
export class GatewayEmitter implements EmittableGateway, ObservableGateway {
  constructor(private readonly listeners = new Map<string, Set<ObservedEventListener>>()) {}

  emit(type: string, event: any): void {
    this.listeners.get(type)?.forEach((listener) => {
      Promise.resolve((() => listener(event))()).catch((error) =>
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
