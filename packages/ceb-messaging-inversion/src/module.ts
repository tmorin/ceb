import { AbstractModule, ComponentSymbol, Container, ContainerSymbol, RegistryKey } from "@tmorin/ceb-inversion-core"
import { Gateway, GatewaySymbol } from "@tmorin/ceb-messaging-core"
import { MessagingComponent } from "./component"

/**
 * The options of {@link MessagingModule}.
 */
export interface MessagingModuleOptions {
  /**
   * The {@link RegistryKey} of the {@link Gateway} instance.
   * By default {@link GatewaySymbol}.
   */
  gatewayRegistryKey: RegistryKey
}

/**
 * The module register the component {@link MessagingComponent} in order to discover and bootstrap handlers and listeners.
 *
 * @example Register the module
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {MessagingModule} from "@tmorin/ceb-messaging-core"
 * ContainerBuilder.get()
 *   .module(new MessagingModule())
 *   .build()
 * ```
 */
export class MessagingModule extends AbstractModule {
  private readonly options: MessagingModuleOptions

  /**
   * @param partialOptions Options of the module.
   */
  constructor(partialOptions: Partial<MessagingModuleOptions> = {}) {
    super()
    this.options = {
      gatewayRegistryKey: GatewaySymbol,
      ...partialOptions,
    }
  }

  async configure(): Promise<void> {
    this.registry.registerFactory(
      ComponentSymbol,
      (registry) =>
        new MessagingComponent(registry.resolve<Container>(ContainerSymbol), registry.resolve<Gateway>(GatewaySymbol)),
      { singleton: true }
    )
  }
}
