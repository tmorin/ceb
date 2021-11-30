import { Container, ContainerSymbol, Module, ModuleConfiguration } from "@tmorin/ceb-inversion-core"
import { GatewayInversionBuilder } from "./builder"

/**
 * The options of {@link GatewayInversionBuilderModule}.
 */
export interface GatewayInversionBuilderModuleOptions {
  /**
   * When `true`, the current container becomes the default one, i.e. {@link GatewayInversionBuilder#setDefaultContainer}
   */
  setDefaultContainer: boolean
}

/**
 * The module can set the default container of {@link GatewayInversionBuilder}.
 *
 * @example Register the module
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {GatewayInversionBuilderModule} from "@tmorin/ceb-messaging-builder-inversion"
 * const container = ContainerBuilder.get()
 *   .module(new GatewayInversionBuilderModule())
 *   .build()
 * ```
 */
export class GatewayInversionBuilderModule implements Module {
  private readonly options: GatewayInversionBuilderModuleOptions

  constructor(
    /**
     * Options of the module.
     */
    partialOptions: Partial<GatewayInversionBuilderModuleOptions> = {}
  ) {
    this.options = {
      setDefaultContainer: true,
      ...partialOptions,
    }
  }

  async initialize(configuration: ModuleConfiguration): Promise<void> {
    if (this.options.setDefaultContainer) {
      GatewayInversionBuilder.setDefaultContainer(configuration.registry.resolve<Container>(ContainerSymbol))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async dispose(): Promise<void> {}
}
