import {
  EmittableEventBus,
  Event,
  EventBus,
  EventBusNotificationMap,
  EventListener,
  ObservableEventBus,
  Removable,
  SubscribeOptions,
} from "@tmorin/ceb-messaging-core"
import { Context, Service, ServiceBroker, ServiceEvent } from "moleculer"
import { type } from "typedoc/dist/lib/output/themes/default/partials/type"

/**
 * The map of the internal events for events handling.
 */
export interface MoleculerEventBusNotificationMap extends EventBusNotificationMap {
  moleculer_service_destruction_failed: {
    name: string
    bus: EventBus
    error: Error
  }
  event_broadcasting_failed: {
    event: Event
    bus: EventBus
    error: Error
  }
  event_emitting_failed: {
    event: Event
    bus: EventBus
    error: Error
  }
}

export interface MoleculerObservableEventBus extends ObservableEventBus {
  /**
   * Listen to an internal event.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  on<K extends keyof MoleculerEventBusNotificationMap>(
    type: K,
    listener: (event: MoleculerEventBusNotificationMap[K]) => any
  ): this

  /**
   * Remove listeners.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  off<K extends keyof MoleculerEventBusNotificationMap>(
    type?: K,
    listener?: (event: MoleculerEventBusNotificationMap[K]) => any
  ): this
}

/**
 * The emitter view of an an {@link EventBus}.
 */
export interface MoleculerEmitterEventBus extends EmittableEventBus {
  /**
   * Emit an internal event.
   * @param type the type
   * @param event the event
   * @template K the type of the internal event
   */
  emit<K extends keyof MoleculerEventBusNotificationMap>(type: K, event: MoleculerEventBusNotificationMap[K]): void
}

function createMoleculerService(
  bus: EventBus,
  emitter: MoleculerEmitterEventBus,
  broker: ServiceBroker,
  listeners: Map<string, Set<[EventListener<any>, Partial<SubscribeOptions>]>>,
  options: Partial<MoleculerEventBusOptions>
) {
  const serviceEvent: ServiceEvent = {
    handler: (context: Context) => {
      const event = context.params as Event
      emitter.emit("event_received", {
        bus,
        event,
      })
      const eventType = event.headers.messageType
      listeners.get(eventType)?.forEach((entry) => {
        const [listener, options] = entry
        Promise.resolve((async () => listener(event))())
          .catch((error: Error) => {
            emitter.emit("event_listener_failed", {
              bus,
              event,
              error,
            })
          })
          .finally(() => {
            if (options.once) {
              listeners.get(eventType)?.delete(entry)
            }
          })
      })
    },
  }

  if (options.moleculerGroup) {
    serviceEvent.group = options.moleculerGroup
  }

  return broker.createService({
    name: "EventBus",
    events: {
      "EventBus.*": serviceEvent,
    },
  })
}

export type MoleculerEventBusOptions = {
  publicationMode: "balanced" | "broadcast"
  moleculerGroup: string
}

/**
 * Implementation of the {@link EventBus} for Moleculer.
 */
export class MoleculerEventBus implements EventBus {
  public readonly service: Service

  constructor(
    private readonly emitter: MoleculerEmitterEventBus,
    private readonly broker: ServiceBroker,
    private readonly options: Partial<MoleculerEventBusOptions> = {},
    private readonly listeners: Map<string, Set<[EventListener<any>, Partial<SubscribeOptions>]>> = new Map()
  ) {
    this.service = createMoleculerService(this, emitter, broker, listeners, options)
  }

  get observer(): MoleculerObservableEventBus {
    return this.emitter
  }

  subscribe<E extends Event = Event>(
    eventType: string,
    listener: EventListener<E>,
    options?: Partial<SubscribeOptions>
  ): Removable {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    const entry: [EventListener<E>, Partial<SubscribeOptions>] = [listener, { ...options }]
    this.listeners.get(eventType)?.add(entry)
    return {
      remove: () => {
        this.listeners.get(eventType)?.delete(entry)
      },
    }
  }

  publish<E extends Event = Event>(...events: Array<E>): void {
    events.forEach((event) => {
      const eventName = `${this.service.name}.${event.headers.messageType}`

      const groupsFromArray: Array<string> = Array.isArray(event.headers.moleculerGroups)
        ? event.headers.moleculerGroups.map((v) => String(v))
        : []
      const groupFromString: Array<string> =
        typeof event.headers.moleculerGroup === "string" ? [event.headers.moleculerGroup] : []
      const groups = groupsFromArray.concat(groupFromString)

      if (this.options.publicationMode === "broadcast") {
        this.broker.broadcast(eventName, event, groups).catch((error: Error) => {
          this.emitter.emit("event_broadcasting_failed", {
            event,
            bus: this,
            error,
          })
        })
      } else {
        this.broker.emit(eventName, event, groups).catch((error: Error) => {
          this.emitter.emit("event_emitting_failed", {
            event,
            bus: this,
            error,
          })
        })
      }
    })
  }

  async dispose(): Promise<void> {
    this.listeners.clear()
    await this.broker.destroyService(this.service).catch((error: Error) =>
      this.emitter.emit("moleculer_service_destruction_failed", {
        bus: this,
        error,
        name: this.service.name,
      })
    )
  }
}
