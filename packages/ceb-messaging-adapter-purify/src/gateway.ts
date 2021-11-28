import {Gateway} from "@tmorin/ceb-messaging-core";
import {PurifyCommandBus} from "./command";
import {PurifyQueryBus} from "./query";

export class PurifyGateway<G extends Gateway = Gateway> {
    constructor(
        gateway: G,
        public readonly commands = new PurifyCommandBus(gateway.commands),
        public readonly queries = new PurifyQueryBus(gateway.queries),
        public readonly events = gateway.events
    ) {
    }
}
