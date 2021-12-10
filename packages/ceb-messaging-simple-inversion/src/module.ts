import { AbstractModule, ComponentSymbol, RegistryKey } from "@tmorin/ceb-inversion-core"
import {
  CommandBusSymbol,
  EmittableGateway,
  EventBusSymbol,
  Gateway,
  GatewayEmitter,
  GatewayEmitterSymbol,
  GatewayObserverSymbol,
  GatewaySymbol,
  ObservableGateway,
  QueryBusSymbol,
} from "@tmorin/ceb-messaging-core"
import { SimpleCommandBus, SimpleEventBus, SimpleGateway, SimpleQueryBus } from "@tmorin/ceb-messaging-simple"

/**
 * The options of {@link SimpleModule}.
 */
export interface SimpleModuleOptions {
  /**
   * The {@link RegistryKey} of the {@link SimpleGateway} instance.
   * By default {@link GatewaySymbol}.
   */
  gatewayRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link SimpleEventBus} instance.
   * By default {@link EventBusSymbol}.
   */
  eventsRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link SimpleCommandBus} instance.
   * By default {@link CommandBusSymbol}.
   */
  commandsRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link SimpleQueryBus} instance.
   * By default {@link QueryBusSymbol}.
   */
  queriesRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link EmittableGateway} instance.
   * By default {@link GatewayEmitterSymbol}.
   */
  emitterRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link ObservableGateway} instance.
   * By default {@link GatewayObserverSymbol}.
   */
  observerRegistryKey: RegistryKey
  /**
   * An optional gateway instance..
   * For instance, it can be `SimpleGateway.GLOBAL`.
   */
  gateway?: SimpleGateway
  /**
   * When `true`, the internal events related to "error" (i.e. `command_handler_failed` ...) are displayed using the `console` methods.
   * By default, `false`.
   */
  errorToConsole: boolean
}

/**
 * The module registers a {@link Gateway} bound with the key {@link GatewaySymbol}.
 *
 * @example Register the module
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {SimpleModule} from "@tmorin/ceb-messaging-simple"
 * const container = ContainerBuilder.get()
 *   .module(new SimpleModule())
 *   .build()
 * ```
 * @example Register the module providing an existing Gateway Instance
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {SimpleModule, SimpleGateway} from "@tmorin/ceb-messaging-simple"
 * const container = ContainerBuilder.get()
 *   .module(new SimpleModule({
 *     gateway: SimpleGateway.GLOBAL
 *   }))
 *   .build()
 * ```
 */
export class SimpleModule extends AbstractModule {
  private readonly options: SimpleModuleOptions

  /**
   * @param partialOptions Options of the module.
   */
  constructor(partialOptions: Partial<SimpleModuleOptions> = {}) {
    super()
    this.options = {
      gatewayRegistryKey: GatewaySymbol,
      eventsRegistryKey: EventBusSymbol,
      commandsRegistryKey: CommandBusSymbol,
      queriesRegistryKey: QueryBusSymbol,
      emitterRegistryKey: GatewayEmitterSymbol,
      observerRegistryKey: GatewayObserverSymbol,
      errorToConsole: false,
      ...partialOptions,
    }
  }

  async configure(): Promise<void> {
    if (this.options.gateway) {
      const gateway = this.options.gateway
      this.registry.registerFactory<SimpleGateway>(this.options.gatewayRegistryKey, () => gateway, { singleton: true })
      this.registry.registerFactory<SimpleEventBus>(
        this.options.eventsRegistryKey,
        (registry) => registry.resolve<SimpleGateway>(this.options.gatewayRegistryKey).events,
        { singleton: true }
      )
      this.registry.registerFactory<SimpleCommandBus>(
        this.options.commandsRegistryKey,
        (registry) => registry.resolve<SimpleGateway>(this.options.gatewayRegistryKey).commands,
        { singleton: true }
      )
      this.registry.registerFactory<SimpleQueryBus>(
        this.options.queriesRegistryKey,
        (registry) => registry.resolve<SimpleGateway>(this.options.gatewayRegistryKey).queries,
        { singleton: true }
      )
      this.registry.registerFactory<EmittableGateway>(
        this.options.emitterRegistryKey,
        (registry) => registry.resolve<SimpleGateway>(this.options.gatewayRegistryKey).emitter,
        { singleton: true }
      )
      this.registry.registerFactory<ObservableGateway>(
        this.options.observerRegistryKey,
        (registry) => registry.resolve<SimpleGateway>(this.options.gatewayRegistryKey).observer,
        { singleton: true }
      )
    } else {
      this.registry.registerFactory<EmittableGateway>(this.options.emitterRegistryKey, () => new GatewayEmitter(), {
        singleton: true,
      })
      this.registry.registerFactory<ObservableGateway>(
        this.options.observerRegistryKey,
        (registry) => registry.resolve<GatewayEmitter>(GatewayEmitterSymbol),
        { singleton: true }
      )
      this.registry.registerFactory<SimpleEventBus>(
        this.options.eventsRegistryKey,
        (registry) => new SimpleEventBus(registry.resolve<GatewayEmitter>(this.options.emitterRegistryKey)),
        { singleton: true }
      )
      this.registry.registerFactory<SimpleCommandBus>(
        this.options.commandsRegistryKey,
        (registry) =>
          new SimpleCommandBus(
            registry.resolve<SimpleEventBus>(this.options.eventsRegistryKey),
            registry.resolve<GatewayEmitter>(this.options.emitterRegistryKey)
          ),
        { singleton: true }
      )
      this.registry.registerFactory<SimpleQueryBus>(
        this.options.queriesRegistryKey,
        (registry) => new SimpleQueryBus(registry.resolve<GatewayEmitter>(this.options.emitterRegistryKey)),
        { singleton: true }
      )
      this.registry.registerFactory<SimpleGateway>(
        this.options.gatewayRegistryKey,
        (registry) =>
          new SimpleGateway(
            registry.resolve<SimpleEventBus>(this.options.eventsRegistryKey),
            registry.resolve<SimpleCommandBus>(this.options.commandsRegistryKey),
            registry.resolve<SimpleQueryBus>(this.options.queriesRegistryKey),
            registry.resolve<EmittableGateway>(this.options.emitterRegistryKey)
          ),
        { singleton: true }
      )
    }
    this.registry.registerFactory(ComponentSymbol, (registry) => ({
      configure: async () => {
        if (this.options.errorToConsole) {
          const observer = registry.resolve<Gateway>(this.options.gatewayRegistryKey).observer
          // COMMAND
          observer.on("command_handler_failed", ({ command, error }) => {
            const identifier = `${command.headers.messageType}/${command.headers.messageId}`
            const message = `SimpleModule - a command handler of ${identifier} throws an error`
            console.error(message, error)
          })
          observer.on("command_handler_not_found", ({ error }) => {
            console.debug("SimpleModule - a command handler cannot be found", error.message)
          })
          // QUERY
          observer.on("query_handler_failed", ({ query, error }) => {
            const identifier = `${query.headers.messageType}/${query.headers.messageId}`
            const message = `SimpleModule - a query handler of ${identifier} throws an error`
            console.error(message, error)
          })
          observer.on("query_handler_not_found", ({ error }) => {
            console.debug("SimpleModule - a query handler cannot be found", error.message)
          })
          // EVENT
          observer.on("event_listener_failed", ({ event, error }) => {
            const identifier = `${event.headers.messageType}/${event.headers.messageId}`
            const message = `SimpleModule - an event listener of ${identifier} throws an error`
            console.error(message, error)
          })
        }
      },
      dispose: async () => {
        await registry.resolve<Gateway>(this.options.gatewayRegistryKey).dispose()
      },
    }))
  }
}
