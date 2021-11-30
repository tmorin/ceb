import {AbstractModule, Component, ComponentSymbol, RegistryKey} from "@tmorin/ceb-inversion-core"
import {Gateway, GatewaySymbol} from "@tmorin/ceb-messaging-core"
import {CommandForwarder} from "./command"
import {EventForwarder} from "./event"
import {QueryForwarder} from "./query"

/**
 * The options of {@link DomAdapterModule}.
 */
export interface DomAdapterModuleOptions {
  /**
   * The {@link RegistryKey} of the {@link Gateway} instance.
   * By default {@link GatewaySymbol}.
   */
  gatewayRegistryKey: RegistryKey
  /**
   * The Event Target where the global listeners are added.
   * @default `window`
   */
  target: EventTarget
}

/**
 * The module registers global Event listeners forwarding messages to a given {@link Gateway}.
 *
 * @example Register the module
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {SimpleModule} from "@tmorin/ceb-messaging-simple"
 * import {DomAdapterModule} from "@tmorin/ceb-messaging-adapt-dom"
 * const container = ContainerBuilder.get()
 *   .module(new SimpleModule())
 *   .module(new DomAdapterModule())
 *   .build()
 * ```
 */
export class DomAdapterModule extends AbstractModule {
  private readonly options: DomAdapterModuleOptions

  /**
   * @param partialOptions Options of the module.
   */
  constructor(partialOptions: Partial<DomAdapterModuleOptions> = {}) {
    super()
    this.options = {
      gatewayRegistryKey: GatewaySymbol,
      target: window,
      ...partialOptions,
    }
  }

  async configure(): Promise<void> {
    // COMMAND
    this.registry.registerFactory<Component>(
      ComponentSymbol,
      (registry) =>
        new CommandForwarder(this.options.target, registry.resolve<Gateway>(this.options.gatewayRegistryKey))
    )
    // EVENT
    this.registry.registerFactory<Component>(
      ComponentSymbol,
      (registry) => new EventForwarder(this.options.target, registry.resolve<Gateway>(this.options.gatewayRegistryKey))
    )
    // QUERY
    this.registry.registerFactory<Component>(
      ComponentSymbol,
      (registry) => new QueryForwarder(this.options.target, registry.resolve<Gateway>(this.options.gatewayRegistryKey))
    )
  }
}
