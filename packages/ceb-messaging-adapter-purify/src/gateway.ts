import {EventBus, ObservableGateway} from "@tmorin/ceb-messaging-core";
import {PurifyCommandBus} from "./command"
import {PurifyQueryBus} from "./query"

/**
 * The gateway is a low level artifact exposing the messaging buses.
 */
export class PurifyGateway<E extends EventBus = EventBus, O extends ObservableGateway = ObservableGateway> {
    constructor(
        /**
         * The bus for commands.
         */
        readonly commands: PurifyCommandBus,
        /**
         * The bus for queries.
         */
        readonly queries: PurifyQueryBus,
        /**
         * The bus for events.
         */
        readonly events: E,
        /**
         * The observable view point of the gateway.
         */
        readonly observer: O,
    ) {
    }
}
