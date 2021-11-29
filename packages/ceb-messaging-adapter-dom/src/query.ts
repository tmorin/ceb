import {Component} from "@tmorin/ceb-inversion-core";
import {Gateway, MessageBuilder} from "@tmorin/ceb-messaging-core";
import {DomQuery, DomResult, DomResultError} from "./message";

export class QueryForwarder implements Component {

    constructor(
        readonly target: EventTarget = window,
        readonly gateway: Gateway
    ) {
    }

    private listener?: EventListener

    async configure(): Promise<void> {
        this.listener = async (event: Event) => {
            if (event instanceof DomQuery) {
                try {
                    const result = await this.gateway.queries.execute(event.detail)
                    event.target?.dispatchEvent(new DomResult(result))
                } catch (e: any) {
                    const result = MessageBuilder.result<Error>(event.detail).body(e).build()
                    event.target?.dispatchEvent(new DomResultError(result))
                }
            }
        }
        this.target.addEventListener(DomQuery.CUSTOM_EVENT_TYPE, this.listener)
    }

    async dispose(): Promise<void> {
        if (this.listener) {
            this.target.removeEventListener(DomQuery.CUSTOM_EVENT_TYPE, this.listener)
        }
    }

}
