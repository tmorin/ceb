import {Bus} from "@tmorin/ceb-messaging-core";
import {MessageConstructor, MessageEvent, MessageType} from "@tmorin/ceb-messaging-core/src";

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
 * @param bus the bus
 * @param EventType the type of the event
 * @param options the options
 */
export function waitForEvents<E extends MessageEvent>(
    bus: Bus,
    EventType: MessageType | MessageConstructor<E>,
    options: Partial<WaitEventsOptions> = {},
): Promise<Array<E>> {
    return new Promise((resolve, reject) => {
        const opts: WaitEventsOptions = {
            occurrences: 1,
            timeout: 500,
            ...options
        }
        let counter = 0
        let events: Array<E> = []
        const subscription = bus.subscribe<E>(EventType, (event) => {
            counter++
            events.push(event)
            if (counter >= opts.occurrences) {
                clearTimeout(timeoutId)
                resolve(events)
            }
        })
        const timeoutId = setTimeout(() => {
            subscription.unsubscribe()
            reject(new Error("unable to get expected events on time"))
        }, opts.timeout)
    })
}
