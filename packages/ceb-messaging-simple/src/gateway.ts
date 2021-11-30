import {EmittableGateway, Gateway, GatewayEmitter, ObservableGateway} from "@tmorin/ceb-messaging-core"
import {SimpleEventBus} from "./event"
import {SimpleCommandBus} from "./command"
import {SimpleQueryBus} from "./query"

/**
 * The symbol used to register {@link SimpleGateway}.
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
   */
  static get GLOBAL(): SimpleGateway {
    if (!this.#GLOBAL) {
      this.#GLOBAL = this.create()
    }
    return this.#GLOBAL
  }

  /**
   * Create a {@link SimpleGateway} from scratch
   */
  static create(): SimpleGateway {
    const emitter = new GatewayEmitter()
    const events = new SimpleEventBus(emitter)
    return new SimpleGateway(
      new SimpleEventBus(emitter),
      new SimpleCommandBus(events, emitter),
      new SimpleQueryBus(emitter),
      emitter
    )
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
