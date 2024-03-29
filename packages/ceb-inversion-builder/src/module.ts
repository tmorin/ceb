import { Container, ContainerSymbol, Module, ModuleConfiguration } from "@tmorin/ceb-inversion-core"
import { InversionBuilder } from "./builder"

/**
 * The options of {@link InversionBuilderModule}.
 */
export interface InversionBuilderModuleOptions {
  /**
   * When `true`, the current container becomes the default one, i.e. {@link InversionBuilder#setDefaultContainer}
   */
  setDefaultContainer: boolean
}

/**
 * The module can set the default container of {@link InversionBuilder}.
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
export class InversionBuilderModule implements Module {
  private readonly options: InversionBuilderModuleOptions

  constructor(
    /**
     * Options of the module.
     */
    partialOptions: Partial<InversionBuilderModuleOptions> = {}
  ) {
    this.options = {
      setDefaultContainer: true,
      ...partialOptions,
    }
  }

  async initialize(configuration: ModuleConfiguration): Promise<void> {
    if (this.options.setDefaultContainer) {
      InversionBuilder.setDefaultContainer(configuration.registry.resolve<Container>(ContainerSymbol))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async dispose(): Promise<void> {}
}
