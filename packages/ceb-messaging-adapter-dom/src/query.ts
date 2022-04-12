import { Component } from "@tmorin/ceb-inversion-core"
import { Gateway, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { DomQuery, DomResult, DomResultError } from "./message"

/**
 * The component implements a Bridge to forward query messages from a DOM {@link EventTarget} object to a {@link Gateway}.
 * The bridge translate {@link DomQuery} to {@link Query} and also {@link Result} to {@link DomResult}.
 */
export class QueryForwarder implements Component {
  private domListener?: EventListener

  constructor(readonly target: EventTarget = window, readonly gateway: Gateway) {}

  async configure(): Promise<void> {
    this.domListener = (event: Event) => {
      if (event instanceof DomQuery) {
        this.gateway.queries
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
    this.target.addEventListener(DomQuery.CUSTOM_EVENT_TYPE, this.domListener)
  }

  async dispose(): Promise<void> {
    if (this.domListener) {
      this.target.removeEventListener(DomQuery.CUSTOM_EVENT_TYPE, this.domListener)
    }
  }
}
