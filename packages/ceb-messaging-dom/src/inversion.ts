import {AbstractModule, ComponentSymbol, RegistryKey} from "@tmorin/ceb-inversion-core";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {DomBus} from "./bus";

/**
 * The options of {@link DomModule}.
 */
export interface DomModuleOptions {
    /**
     * The global event target.
     * By default `window`.
     */
    global: EventTarget
    /**
     * The requester event target.
     * By default `window`.
     */
    requester: EventTarget
    /**
     * The {@link RegistryKey} of the {@link DomBus} instance.
     * By default {@link BusSymbol}.
     */
    registryKey: RegistryKey
    /**
     * When `true`, the `error` internal events (i.e. `bus.on("error", ...)`) are displayed using `console.error(...)`.
     * By default `false`.
     */
    errorToConsole: boolean
}

/**
 * The module registers a {@link Bus} bound with the key {@link BusSymbol}
 *
 * @example Register the DomModule
 * ```typescript
 * import {inversion, messaging} from "@tmorin/ceb-bundle-web"
 * const container = inversion.ContainerBuilder.get()
 *   .module(new messaging.DomModule())
 *   .build()
 * ```
 */
export class DomModule extends AbstractModule {
    private readonly options: DomModuleOptions

    constructor(
        /**
         * Options of the module.
         */
        partialOptions: Partial<DomModuleOptions> = {}
    ) {
        super()
        this.options = {
            global: window,
            requester: window,
            registryKey: BusSymbol,
            errorToConsole: false,
            ...partialOptions
        }
    }

    async configure(): Promise<void> {
        this.registry.registerFactory<Bus>(this.options.registryKey, () => new DomBus(this.options.global, this.options.requester))
        this.registry.registerFactory(ComponentSymbol, (registry) => ({
            configure: async () => {
                if (this.options.errorToConsole) {
                    const bus = registry.resolve<Bus>(this.options.registryKey)
                    bus.on("action_handler_failed", ({action, error}) => {
                        const identifier = `${action.headers.messageType}/${action.headers.messageId}`
                        const message = `DomBus - an action handler of ${identifier} throws an error`
                        console.error(message, error);
                    })
                    bus.on("event_listener_failed", ({event, error}) => {
                        const identifier = `${event.headers.messageType}/${event.headers.messageId}`
                        const message = `DomBus - an event listener of ${identifier} throws an error`
                        console.error(message, error);
                    })
                }
            },
            dispose: async () => {
                await registry.resolve<Bus>(this.options.registryKey).dispose()
            }
        }))
    }
}
