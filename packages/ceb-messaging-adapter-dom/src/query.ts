import { Component } from "@tmorin/ceb-inversion-core"
import { Gateway, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { DomQuery, DomResult, DomResultError } from "./message"

/**
 * The component add a global listener which catches all {@link DomQuery}.
 * Once caught, the query is forwarded to the messaging world.
 * The result is then dispatched on {@link DomQuery}'s target
 */
export class QueryForwarder implements Component {
  private listener?: EventListener

  constructor(readonly gateway: Gateway, readonly target: EventTarget = window) {}

  async configure(): Promise<void> {
    this.listener = async (event: Event) => {
      if (event instanceof DomQuery) {
        await this.gateway.queries
          .execute(event.detail, {
            timeout: event.options.timeout,
          })
          .then((result) => event.target?.dispatchEvent(new DomResult(result)))
          .catch((error: Error) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const result = MessageBuilder.result<Error>(event.detail).body(error).build()
            event.target?.dispatchEvent(new DomResultError(result))
          })
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
