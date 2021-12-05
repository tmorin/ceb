import { EmittableGateway, Gateway, GatewayEmitter, ObservableGateway } from "@tmorin/ceb-messaging-core"
import { SimpleEventBus } from "./event"
import { SimpleCommandBus } from "./command"
import { SimpleQueryBus } from "./query"

/**
 * The symbol used to register {@link SimpleGateway}.
 *
 * @example Creation and destruction
 * ```typescript
 * import { Gateway } from "@tmorin/ceb-messaging-core"
 * import { SimpleGateway } from "@tmorin/ceb-messaging-simple"
 * const gateway : Gateway = SimpleGateway.create()
 * gateway.dispose().catche(e => console.error(e))
 * ```
 *
 * @example Global instance
 * ```typescript
 * import { MessageBuilder } from "@tmorin/ceb-messaging-core"
 * import { SimpleGateway } from "@tmorin/ceb-messaging-simple"
 * const event = MessageBuilder.event("EventA").build()
 * SimpleGateway.GLOBAL.events.publish(event)
 * ```
 */
export const SimpleGatewaySymbol = Symbol.for("ceb/inversion/SimpleGateway")

export class SimpleGateway implements Gateway {
  static #GLOBAL: SimpleGateway

  constructor(
    readonly events: SimpleEventBus,
    readonly commands: SimpleCommandBus,
    readonly queries: SimpleQueryBus,
    readonly emitter: EmittableGateway,
    readonly observer: ObservableGateway = emitter
  ) {}

  /**
   * The global instance.
   *
   * The {@link SimpleGateway} instance is lazily creation.
   */
  static get GLOBAL(): SimpleGateway {
    if (!this.#GLOBAL) {
      this.#GLOBAL = this.create()
    }
    return this.#GLOBAL
  }

  /**
   * A factory method which creates a new {@link SimpleGateway} at each call.
   * The instance is created with the default {@link GatewayEmitter}, {@link SimpleEventBus}, {@link SimpleCommandBus} and {@link SimpleQueryBus}.
   */
  static create(): SimpleGateway {
    const emitter = new GatewayEmitter()
    const events = new SimpleEventBus(emitter)
    const commands = new SimpleCommandBus(events, emitter)
    const queries = new SimpleQueryBus(emitter)
    return new SimpleGateway(events, commands, queries, emitter)
  }

  /**
   * Dispose all channels:
   *
   * - events
   * - commands
   * - queries
   * - observe
   */
  async dispose() {
    await this.events.dispose()
    await this.commands.dispose()
    await this.queries.dispose()
    this.observer.off()
  }
}
