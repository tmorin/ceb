import {AbstractModule, ComponentSymbol} from "@tmorin/ceb-inversion";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {DomBus} from "./bus";

/**
 * The options of {@link DomModule}.
 */
export interface DomModuleOptions {
    /**
     * When `true`, the `error` internal events (i.e. `bus.on("error", ...)`) are displayed using `console.error(...)`.
     */
    errorToConsole: boolean
}

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
        private readonly options: DomModuleOptions = {
            errorToConsole: false
        },
        private readonly bus = new DomBus(global, requester)
    ) {
        super();
    }

    async configure(): Promise<void> {
        this.registry.registerValue(BusSymbol, this.bus)
        this.registry.registerFactory(ComponentSymbol, (registry) => ({
            configure: async () => {
                const bus = registry.resolve<Bus>(BusSymbol)
                if (this.options.errorToConsole) {
                    bus.on("error", error => console.error("DomBus throws an error", error))
                }
            },
            async dispose() {
                await registry.resolve<Bus>(BusSymbol).dispose()
            }
        }))
    }
}
