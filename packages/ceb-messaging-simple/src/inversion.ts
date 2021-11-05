import {AbstractModule, ComponentSymbol} from "@tmorin/ceb-inversion";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {InMemorySimpleBus} from "./bus";

/**
 * The options of {@link SimpleModule}.
 */
export interface SimpleModuleOptions {
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
 *   .module(new messaging.SimpleModule())
 *   .build()
 * ```
 */
export class SimpleModule extends AbstractModule {
    constructor(
        private readonly bus = InMemorySimpleBus.GLOBAL,
        private readonly options: SimpleModuleOptions = {
            errorToConsole: false
        }
    ) {
        super();
    }

    async configure(): Promise<void> {
        this.registry.registerValue(BusSymbol, this.bus)
        this.registry.registerFactory(ComponentSymbol, (registry) => ({
            configure: async () => {
                const bus = registry.resolve<Bus>(BusSymbol)
                if (this.options.errorToConsole) {
                    bus.on("error", error => console.error("InMemorySimpleBus throws an error", error))
                }
            },
            async dispose() {
                await registry.resolve<Bus>(BusSymbol).dispose()
            }
        }))
    }
}
