import {Container, ContainerSymbol, Module, ModuleConfiguration} from "@tmorin/ceb-inversion-core";
import {BusInversionBuilder} from "./builder";

/**
 * The options of {@link BusInversionBuilderModule}.
 */
export interface BusInversionBuilderModuleOptions {
    /**
     * When `true`, the current container becomes the default one, i.e. {@link BusInversionBuilder#setDefaultContainer}
     */
    setDefaultContainer: boolean
}

/**
 * The module can set the default container of {@link BusInversionBuilder}.
 *
 * @example Register the InversionBuilderModule
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {InversionBuilderModule} from "@tmorin/ceb-inversion-builder"
 * const container = ContainerBuilder.get()
 *   .module(new InversionBuilderModule())
 *   .build()
 * ```
 */
export class BusInversionBuilderModule implements Module {
    private readonly options: BusInversionBuilderModuleOptions

    constructor(
        /**
         * Options of the module.
         */
        partialOptions: Partial<BusInversionBuilderModuleOptions> = {}
    ) {
        this.options = {
            setDefaultContainer: true,
            ...partialOptions
        }
    }

    async initialize(configuration: ModuleConfiguration): Promise<void> {
        if (this.options.setDefaultContainer) {
            BusInversionBuilder.setDefaultContainer(configuration.registry.resolve<Container>(ContainerSymbol))
        }
    }

    async dispose(): Promise<void> {
    }
}
