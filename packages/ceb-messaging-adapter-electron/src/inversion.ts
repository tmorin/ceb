import {AbstractModule, Component, ComponentSymbol, RegistryKey} from "@tmorin/ceb-inversion";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {ipcMain, ipcRenderer} from "electron";
import {IpcMessageConverter, IpcMessageConverterSymbol, SimpleIpcMessageConverter} from "./converter";
import {IpcMainBus} from "./bus-main";
import {IpcRendererBus} from "./bus-renderer";

/**
 * The options of {@link ElectronModule}.
 */
export interface ElectronModuleOptions {
    /**
     * The {@link RegistryKey} of the {@link IpcMainBus} or {@link IpcRendererBus} instance.
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
 * The module registers a {@link IpcMainBus} or a {@link IpcRendererBus} bound with the key {@link BusSymbol}
 *
 * @example Register the ElectronModule
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion"
 * import {InMemorySimpleBusSymbol, SimpleModule} from "@tmorin/ceb-messaging-simple";
 * import {ElectronModule} from "@tmorin/ceb-messaging-adapter-electron"
 * const container = ContainerBuilder.get()
 *   .module(new SimpleModule({registryKey: InMemorySimpleBusSymbol}))
 *   .module(new ElectronModule(InMemorySimpleBusSymbol))
 *   .build()
 * ```
 */
export class ElectronModule extends AbstractModule {
    private readonly options: ElectronModuleOptions

    constructor(
        /**
         * The {@link RegistryKey} of the {@link Bus} to wrap.
         */
        private readonly wrappedBusRegistryKey: RegistryKey,
        /**
         * Options of the module.
         */
        partialOptions: Partial<ElectronModuleOptions> = {}
    ) {
        super();
        this.options = {
            registryKey: BusSymbol,
            errorToConsole: false,
            ...partialOptions
        }
    }

    async configure(): Promise<void> {
        this.registry.registerValue(IpcMessageConverterSymbol, new SimpleIpcMessageConverter())

        if (ipcMain) {
            this.registry.registerFactory<Bus>(this.options.registryKey, (registry) => new IpcMainBus(
                registry.resolve<Bus>(this.wrappedBusRegistryKey),
                ipcMain,
                registry.resolve<IpcMessageConverter>(IpcMessageConverterSymbol)
            ))
        }

        if (ipcRenderer) {
            this.registry.registerFactory<Bus>(this.options.registryKey, (registry) => new IpcRendererBus(
                registry.resolve<Bus>(this.wrappedBusRegistryKey),
                ipcRenderer,
                registry.resolve<IpcMessageConverter>(IpcMessageConverterSymbol)
            ))
        }

        this.registry.registerFactory<Component>(ComponentSymbol, (registry) => ({
            configure: async () => {
                if (this.options.errorToConsole) {
                    const bus = registry.resolve<Bus>(this.options.registryKey)
                    const className = ipcMain ? "IpcMainBus" : "IpcRendererBus"
                    bus.on("action_handler_failed", ({action, error}) => {
                        const identifier = `${action.headers.messageType}/${action.headers.messageId}`
                        const message = `${className} - an action handler of ${identifier} throws an error`
                        console.error(message, error);
                    })
                    bus.on("event_listener_failed", ({event, error}) => {
                        const identifier = `${event.headers.messageType}/${event.headers.messageId}`
                        const message = `${className} - an event listener of ${identifier} throws an error`
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
