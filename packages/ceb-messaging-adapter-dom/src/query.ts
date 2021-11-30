import {Component} from "@tmorin/ceb-inversion-core"
import {Gateway, MessageBuilder} from "@tmorin/ceb-messaging-core"
import {DomQuery, DomResult, DomResultError} from "./message"

/**
 * The component add a global listener which catches all {@link DomQuery}.
 * Once caught, the query is forwarded to the messaging world.
 * The result is then dispatched on {@link DomQuery}'s target
 */
export class QueryForwarder implements Component {
  private listener?: EventListener

  constructor(readonly target: EventTarget = window, readonly gateway: Gateway) {}

  async configure(): Promise<void> {
    this.listener = async (event: Event) => {
      if (event instanceof DomQuery) {
        try {
          const result = await this.gateway.queries.execute(event.detail, {
            timeout: event.options.timeout,
          })
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
