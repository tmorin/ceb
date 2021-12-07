import { Component } from "@tmorin/ceb-inversion-core"
import { Gateway, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { DomCommand, DomResult, DomResultError } from "./message"

/**
 * The component implements a Bridge to forward command messages from a DOM {@link EventTarget} object to a {@link Gateway}.
 * The bridge translate {@link DomCommand} to {@link Command} and also {@link Result} to {@link DomResult}.
 */
export class CommandForwarder implements Component {
  private domListener?: EventListener

  constructor(readonly target: EventTarget = window, readonly gateway: Gateway) {}

  async configure(): Promise<void> {
    this.domListener = async (event: Event) => {
      if (event instanceof DomCommand) {
        if (event.options.dispatchResult) {
          await this.gateway.commands
            .execute(event.detail, {
              timeout: event.options.timeout,
            })
            .then((result) => event.target?.dispatchEvent(new DomResult(result)))
            .catch((error: Error) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              const result = MessageBuilder.result<Error>(event.detail).body(error).build()
              event.target?.dispatchEvent(new DomResultError(result))
            })
        } else {
          this.gateway.commands.executeAndForget(event.detail)
        }
      }
    }
    this.target.addEventListener(DomCommand.CUSTOM_EVENT_TYPE, this.domListener)
  }

  async dispose(): Promise<void> {
    if (this.domListener) {
      this.target.removeEventListener(DomCommand.CUSTOM_EVENT_TYPE, this.domListener)
    }
  }
}
