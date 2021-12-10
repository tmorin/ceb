import { Event, EventListener } from "@tmorin/ceb-messaging-core"

/**
 * The symbol used to register {@link DiscoverableEventListener}.
 */
export const DiscoverableEventListenerSymbol = Symbol.for("ceb/inversion/DiscoverableEventListener")

/**
 * An event handler discovered by the container on startup.
 *
 * @template E the type of the Event
 */
export type DiscoverableEventListener<E extends Event = Event> = {
  type: string
  listener: EventListener<E>
}
