import {Event, Gateway, MessageType} from "@tmorin/ceb-messaging-core"

/**
 * The options of {@link waitForEvents}.
 */
export type WaitEventsOptions = {
  /**
   * The number of expected occurrences.
   * @default 1
   */
  occurrences: number
  /**
   * The maximum number of milliseconds to wait for.
   * @default 500
   */
  timeout: number
}

/**
 * Wait for events matching a specific type.
 *
 * @param gateway the gateway
 * @param eventType the type of the event
 * @param options the options
 */
export function waitForEvents<E extends Event = Event>(
  gateway: Gateway,
  eventType: MessageType,
  options: Partial<WaitEventsOptions> = {}
): Promise<Array<E>> {
  return new Promise((resolve, reject) => {
    const opts: WaitEventsOptions = {
      occurrences: 1,
      timeout: 500,
      ...options,
    }
    let counter = 0
    let events: Array<E> = []
    const subscription = gateway.events.subscribe<E>(eventType, (event) => {
      counter++
      events.push(event)
      if (counter >= opts.occurrences) {
        clearTimeout(timeoutId)
        resolve(events)
      }
    })
    const timeoutId = setTimeout(() => {
      subscription.remove()
      reject(new Error("unable to get expected events on time"))
    }, opts.timeout)
  })
}
