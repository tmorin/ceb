import {AbstractModule} from "@tmorin/ceb-inversion";
import {BusSymbol} from "@tmorin/ceb-messaging-core";
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
        private readonly global: EventTarget = window,
        private readonly requester: EventTarget = global,
        private readonly bus = new DomBus(global, requester)
    ) {
        super();
    }

    async configure(): Promise<void> {
        this.registry.registerValue(BusSymbol, this.bus)
    }

    async dispose(): Promise<void> {
        await this.bus.dispose()
    }
}
