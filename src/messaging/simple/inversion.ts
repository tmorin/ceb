import {AbstractModule} from "../../inversion";
import {BusSymbol} from "../model";
import {InMemorySimpleBus} from "./bus";

/**
 * The module registers a {@link Bus} bound with the key {@link BusSymbol}
 *
 * @example Register the DomModule
 * ```typescript
 * import {inversion, messaging} from "@tmorin/ceb"
 * const container = inversion.ContainerBuilder.get()
 *   .module(new messaging.SimpleModule())
 *   .build()
 * ```
 */
export class SimpleModule extends AbstractModule {
    constructor(
        private readonly bus = InMemorySimpleBus.GLOBAL
    ) {
        super();
    }

    async configure(): Promise<void> {
        this.registry.registerValue(BusSymbol, this.bus)
    }

    async dispose(): Promise<void> {
        await this.bus.destroy()
    }
}
