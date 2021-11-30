import {Component} from "@tmorin/ceb-inversion-core"
import {Gateway, MessageBuilder} from "@tmorin/ceb-messaging-core"
import {DomCommand, DomResult, DomResultError} from "./message"

/**
 * The component add a global listener which catches all {@link DomCommand}.
 * Once caught, the command is forwarded to the messaging world.
 * The result is then dispatched on {@link DomCommand}'s target
 */
export class CommandForwarder implements Component {

    private listener?: EventListener

    constructor(
        readonly target: EventTarget = window,
        readonly gateway: Gateway
    ) {
    }

    async configure(): Promise<void> {
        this.listener = async (event: Event) => {
            if (event instanceof DomCommand) {
                if (event.options.dispatchResult) {
                    try {
                        const result = await this.gateway.commands.execute(event.detail, {
                            timeout: event.options.timeout
                        })
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
