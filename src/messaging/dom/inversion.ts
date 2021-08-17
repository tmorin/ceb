import {AbstractModule} from "../../inversion";
import {BusSymbol} from "../model";
import {DomBus} from "./bus";

/**
 * The module registers a {@link Bus} bound with the key {@link BusSymbol}
 *
 * @example Register the DomModule
 * ```typescript
 * import {inversion, messaging} from "@tmorin/ceb"
 * const container = inversion.ContainerBuilder.get()
 *   .module(new messaging.DomModule())
 *   .build()
 * ```
 */
export class DomModule extends AbstractModule {
    constructor(
        readonly global: EventTarget = window,
        readonly requester: EventTarget = global,
        readonly bus = new DomBus(global, requester)
    ) {
        super();
    }

    async configure(): Promise<void> {
        this.bus.start()
        this.registry.registerValue(BusSymbol, this.bus)
    }

    async dispose(): Promise<void> {
        await this.bus.stop()
    }
}
