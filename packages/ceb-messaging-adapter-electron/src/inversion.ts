import {AbstractModule, ComponentSymbol, Component} from "@tmorin/ceb-inversion";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {ipcMain, ipcRenderer} from "electron";
import {IpcMessageConverter, IpcMessageConverterSymbol, SimpleIpcMessageConverter} from "./converter";
import {IpcMainBus, IpcMainBusSymbol} from "./bus-main";
import {IpcRendererBus, IpcRendererBusSymbol} from "./bus-renderer";

/**
 * The options of {@link ElectronModule}.
 */
export interface ElectronModuleOptions {
    /**
     * When `true`, the `error` internal events (i.e. `bus.on("error", ...)`) are displayed using `console.error(...)`.
     */
    errorToConsole: boolean
}

/**
 * The module registers a {@link IpcMainBus} or a {@link IpcRendererBus} bound with the key {@link BusSymbol}
 *
 * @example Register the ElectronModule
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion"
 * import {ElectronModule} from "@tmorin/ceb-messaging-adapter-electron"
 * const container = ContainerBuilder.get()
 *   .module(new ElectronModule())
 *   .build()
 * ```
 */
export class ElectronModule extends AbstractModule {
    constructor(
        private readonly options: ElectronModuleOptions = {
            errorToConsole: false
        }
    ) {
        super();
    }

    async configure(): Promise<void> {
        this.registry.registerValue(IpcMessageConverterSymbol, new SimpleIpcMessageConverter())

        if (ipcMain) {
            this.registry.registerFactory<IpcMainBus>(IpcMainBusSymbol, (registry) => {
                const bus = new IpcMainBus(
                    registry.resolve<Bus>(BusSymbol),
                    ipcMain,
                    registry.resolve<IpcMessageConverter>(IpcMessageConverterSymbol)
                )
                this.registry.registerValue(BusSymbol, bus)
                return bus
            })
            this.registry.registerFactory<Component>(ComponentSymbol, (registry) => ({
                configure: async () => {
                    const bus = registry.resolve<Bus>(IpcMainBusSymbol)
                    if (this.options.errorToConsole) {
                        bus.on("error", error => console.error("IpcMainBus throws an error", error))
                    }
                },
                async dispose() {
                    await registry.resolve<Bus>(IpcMainBusSymbol).dispose()
                }
            }))
        }

        if (ipcRenderer) {
            this.registry.registerFactory<IpcRendererBus>(IpcRendererBusSymbol, (registry) => {
                const bus = new IpcRendererBus(
                    registry.resolve<Bus>(BusSymbol),
                    ipcRenderer,
                    registry.resolve<IpcMessageConverter>(IpcMessageConverterSymbol)
                )
                this.registry.registerValue(BusSymbol, bus)
                return bus
            })
            this.registry.registerFactory<Component>(ComponentSymbol, (registry) => ({
                configure: async () => {
                    console.log("ElectronModule", "configure before", registry.resolveAll<Bus>(BusSymbol))
                    const bus = registry.resolve<Bus>(IpcRendererBusSymbol)
                    console.log("ElectronModule", "configure after", registry.resolveAll<Bus>(BusSymbol))
                    if (this.options.errorToConsole) {
                        bus.on("error", error => console.error("IpcRendererBus throws an error", error))
                    }
                },
                async dispose() {
                    await registry.resolve<Bus>(IpcRendererBusSymbol).dispose()
                }
            }))
        }
    }
}
