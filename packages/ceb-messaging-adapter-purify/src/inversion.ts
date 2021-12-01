import { AbstractModule, RegistryKey } from "@tmorin/ceb-inversion-core"
import {
  CommandBus,
  CommandBusSymbol,
  EventBus,
  EventBusSymbol,
  GatewayObserverSymbol,
  GatewaySymbol,
  ObservableGateway,
  QueryBus,
  QueryBusSymbol,
} from "@tmorin/ceb-messaging-core"
import { PurifyGateway } from "./gateway"
import { PurifyQueryBus, PurifyQueryBusSymbol } from "./query"
import { PurifyCommandBus, PurifyCommandBusSymbol } from "./command"

/**
 * The options of {@link PurifyModule}.
 */
export interface PurifyModuleOptions {
  /**
   * The {@link RegistryKey} of the new {@link PurifyGateway} instance.
   * By default {@link GatewaySymbol}.
   */
  purifyGatewayRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of an existing {@link EventBus} instance.
   * By default {@link EventBusSymbol}.
   */
  eventsRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of an existing {@link CommandBus} instance.
   * By default {@link CommandBusSymbol}.
   */
  commandsRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of an existing {@link QueryBus} instance.
   * By default {@link QueryBusSymbol}.
   */
  queriesRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link ObservableGateway} instance.
   * By default {@link GatewayObserverSymbol}.
   */
  observerRegistryKey: RegistryKey
}

/**
 * The module register the {@link PurifyGateway} in the container with the key {@link GatewaySymbol}.
 *
 * @example Register the module
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core";
 * import {SimpleGatewaySymbol, SimpleModule} from "@tmorin/ceb-messaging-simple";
 * import {Gateway, GatewaySymbol} from "@tmorin/ceb-messaging-core";
 * const container = ContainerBuilder.get()
 *   .module(new SimpleModule({gatewayRegistryKey: SimpleGatewaySymbol}))
 *   .module(new PurifyModule())
 *   .build()
 * ```
 */
export class PurifyModule extends AbstractModule {
  private readonly options: PurifyModuleOptions

  /**
   * @param partialOptions Options of the module.
   */
  constructor(partialOptions: Partial<PurifyModuleOptions> = {}) {
    super()
    this.options = {
      purifyGatewayRegistryKey: GatewaySymbol,
      eventsRegistryKey: EventBusSymbol,
      commandsRegistryKey: CommandBusSymbol,
      queriesRegistryKey: QueryBusSymbol,
      observerRegistryKey: GatewayObserverSymbol,
      ...partialOptions,
    }
  }

  async configure(): Promise<void> {
    this.registry.registerFactory<PurifyCommandBus>(
      PurifyCommandBusSymbol,
      (registry) => new PurifyCommandBus(registry.resolve<CommandBus>(this.options.commandsRegistryKey))
    )
    this.registry.registerFactory<PurifyQueryBus>(
      PurifyQueryBusSymbol,
      (registry) => new PurifyQueryBus(registry.resolve<QueryBus>(this.options.queriesRegistryKey))
    )
    this.registry.registerFactory(
      this.options.purifyGatewayRegistryKey,
      (registry) =>
        new PurifyGateway(
          registry.resolve<PurifyCommandBus>(PurifyCommandBusSymbol),
          registry.resolve<PurifyQueryBus>(PurifyQueryBusSymbol),
          registry.resolve<EventBus>(this.options.eventsRegistryKey),
          registry.resolve<ObservableGateway>(this.options.observerRegistryKey)
        )
    )
  }
}
