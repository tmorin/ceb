import {Gateway} from "@tmorin/ceb-messaging-core"
import {IpcRendererEventBus} from "./event"
import {IpcRendererCommandBus} from "./command"
import {IpcRendererQueryBus} from "./query"
import {IpcGatewayObserver} from "../common"

/**
 * The symbol used to register {@link IpcRendererGateway}.
 */
export const IpcRendererGatewaySymbol = Symbol.for("ceb/inversion/IpcRendererGateway")

export class IpcRendererGateway implements Gateway {
  constructor(
    readonly events: IpcRendererEventBus,
    readonly commands: IpcRendererCommandBus,
    readonly queries: IpcRendererQueryBus,
    readonly observer = new IpcGatewayObserver(events.observer, commands.observer, queries.observer)
  ) {}

  async dispose(): Promise<void> {
    await this.events.dispose()
    await this.commands.dispose()
    await this.queries.dispose()
    this.observer.off()
  }
}
