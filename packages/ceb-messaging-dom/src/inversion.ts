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
     * When `true`, the internal events related to "error" (i.e. `action_handler_failed` ...) are displayed using the `console` methods.
     * By default `false`.
     */
    errorToConsole: boolean
}

/**
 * The module registers a {@link Bus} bound with the key {@link BusSymbol}.
 *
 * @example Register the module
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {DomModule} from "@tmorin/ceb-messaging-dom"
 * const container = ContainerBuilder.get()
 *   .module(new DomModule())
 *   .build()
 * ```
 */
export class DomModule extends AbstractModule {
    private readonly options: DomModuleOptions

    /**
     * @param partialOptions Options of the module.
     */
    constructor(
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
                    bus.on("action_handler_not_found", ({error}) => {
                        console.debug("DomBus - an handler cannot be found", error.message);
                    })
                }
            },
            dispose: async () => {
                await registry.resolve<Bus>(this.options.registryKey).dispose()
            }
        }))
    }
}
