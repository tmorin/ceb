import {Gateway} from "@tmorin/ceb-messaging-core"
import {IpcMainEventBus} from "./event"
import {IpcMainCommandBus} from "./command"
import {IpcMainQueryBus} from "./query"
import {IpcGatewayObserver} from "../common"

/**
 * The symbol used to register {@link IpcMainGateway}.
 */
export const IpcMainGatewaySymbol = Symbol.for("ceb/inversion/IpcMainGateway")

export class IpcMainGateway implements Gateway {

    constructor(
        readonly events: IpcMainEventBus,
        readonly commands: IpcMainCommandBus,
        readonly queries: IpcMainQueryBus,
        readonly observer = new IpcGatewayObserver(
            events.observer,
            commands.observer,
            queries.observer
        )
    ) {
    }

    async dispose(): Promise<void> {
        await this.events.dispose()
        await this.commands.dispose()
        await this.queries.dispose()
        this.observer.off()
    }
}
