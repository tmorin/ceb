import {MessageEvent} from "./message";

/**
 * The listener of a subscription.
 */
export interface ElementSubscriptionListener<E extends HTMLElement = HTMLElement, M extends MessageEvent = MessageEvent> {
    /**
     * @param el the Custom Element
     * @param event the message
     * @template E the type of the Custom Element
     * @template M the type of the Event Message
     */
    (el: E, event: M): void
}
