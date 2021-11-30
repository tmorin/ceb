import {Component} from "@tmorin/ceb-inversion-core"
import {Gateway} from "@tmorin/ceb-messaging-core"
import {DomEvent} from "./message"

/**
 * The component add a global listener which catches all {@link DomEvent}.
 * Once caught, the event is forwarded to the messaging world.
 */
export class EventForwarder implements Component {

    private listener?: EventListener

    constructor(
        readonly target: EventTarget = window,
        readonly gateway: Gateway
    ) {
    }

    async configure(): Promise<void> {
        this.listener = (event: Event) => {
            if (event instanceof DomEvent) {
                this.gateway.events.publish(event.detail)
            }
        }
        this.target.addEventListener(DomEvent.CUSTOM_EVENT_TYPE, this.listener)
    }

    async dispose(): Promise<void> {
        if (this.listener) {
            this.target.removeEventListener(DomEvent.CUSTOM_EVENT_TYPE, this.listener)
        }
    }

}
