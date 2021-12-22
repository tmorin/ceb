import { EmittableGateway, Gateway, ObservableGateway } from "@tmorin/ceb-messaging-core"
import { MoleculerEventBus } from "./event"
import { MoleculerCommandBus } from "./command"
import { MoleculerQueryBus } from "./query"

/**
 * The symbol used to register {@link MoleculerGateway}.
 *
 * @example Creation and destruction
 * ```typescript
 * import { Gateway } from "@tmorin/ceb-messaging-core"
 * import { MoleculerGateway } from "@tmorin/ceb-messaging-moleculer"
 * const gateway : Gateway = MoleculerGateway.create()
 * gateway.dispose().catche(e => console.error(e))
 * ```
 *
 * @example Global instance
 * ```typescript
 * import { MessageBuilder } from "@tmorin/ceb-messaging-core"
 * import { MoleculerGateway } from "@tmorin/ceb-messaging-moleculer"
 * const event = MessageBuilder.event("EventA").build()
 * MoleculerGateway.GLOBAL.events.publish(event)
 * ```
 */
export const MoleculerGatewaySymbol = Symbol.for("ceb/inversion/MoleculerGateway")

export class MoleculerGateway implements Gateway {
  constructor(
    readonly events: MoleculerEventBus,
    readonly commands: MoleculerCommandBus,
    readonly queries: MoleculerQueryBus,
    readonly emitter: EmittableGateway,
    readonly observer: ObservableGateway = emitter
  ) {}

  /**
   * Dispose all channels:
   *
   * - events
   * - commands
   * - queries
   * - observer
   */
  async dispose() {
    await this.events.dispose()
    await this.commands.dispose()
    await this.queries.dispose()
    this.observer.off()
  }
}
