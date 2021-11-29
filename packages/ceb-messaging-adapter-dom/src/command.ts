import {Component} from "@tmorin/ceb-inversion-core";
import {Gateway, MessageBuilder} from "@tmorin/ceb-messaging-core";
import {DomCommand, DomResult, DomResultError} from "./message";

export class CommandForwarder implements Component {

    constructor(
        readonly target: EventTarget = window,
        readonly gateway: Gateway
    ) {
    }

    private listener?: EventListener

    async configure(): Promise<void> {
        this.listener = async (event: Event) => {
            if (event instanceof DomCommand) {
                if (event.dispatchResult) {
                    try {
                        const result = await this.gateway.commands.execute(event.detail)
                        event.target?.dispatchEvent(new DomResult(result))
                    } catch (e: any) {
                        const result = MessageBuilder.result<Error>(event.detail).body(e).build()
                        event.target?.dispatchEvent(new DomResultError(result))
                    }
                } else {
                    this.gateway.commands.executeAndForget(event.detail)
                }
            }
        }
        this.target.addEventListener(DomCommand.CUSTOM_EVENT_TYPE, this.listener)
    }

    async dispose(): Promise<void> {
        if (this.listener) {
            this.target.removeEventListener(DomCommand.CUSTOM_EVENT_TYPE, this.listener)
        }
    }

}
