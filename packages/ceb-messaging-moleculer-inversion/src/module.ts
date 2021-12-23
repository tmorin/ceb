import { AbstractModule, ComponentSymbol, Container, ContainerSymbol, RegistryKey } from "@tmorin/ceb-inversion-core"
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
import {
  MoleculerCommandBus,
  MoleculerEventBus,
  MoleculerEventBusOptions,
  MoleculerGateway,
  MoleculerObservableCommandBus,
  MoleculerObservableEventBus,
  MoleculerObservableQueryBus,
  MoleculerQueryBus,
} from "@tmorin/ceb-messaging-moleculer"
import { ServiceBroker } from "moleculer"

/**
 * The symbol used to register {@link ServiceBroker}.
 */
export const ServiceBrokerSymbol = Symbol.for("ceb/moleculer/ServiceBroker")

/**
 * The options of {@link MoleculerModule}.
 */
export interface MoleculerModuleOptions {
  /**
   * The {@link RegistryKey} of the {@link MoleculerGateway} instance.
   * By default {@link GatewaySymbol}.
   */
  gatewayRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link MoleculerEventBus} instance.
   * By default {@link EventBusSymbol}.
   */
  eventsRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link MoleculerCommandBus} instance.
   * By default {@link CommandBusSymbol}.
   */
  commandsRegistryKey: RegistryKey
  /**
   * The {@link RegistryKey} of the {@link MoleculerQueryBus} instance.
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
   * The {@link RegistryKey} of the {@link ServiceBroker} instance.
   * By default {@link ServiceBrokerSymbol}.
   */
  brokerRegistryKey: RegistryKey
  /**
   * An optional {@link ServiceBroker} instance.
   * If provided it will be registered with {@link MoleculerModuleOptions.brokerRegistryKey}.
   */
  broker?: ServiceBroker
  /**
   * Optional options for the {@link MoleculerEventBus}.
   */
  eventBusOptions?: MoleculerEventBusOptions
  /**
   * When `true`, the internal events related to "error" (i.e. `command_handler_failed` ...) are displayed using the broker logger.
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
 * import {MoleculerModule} from "@tmorin/ceb-messaging-moleculer"
 * const container = ContainerBuilder.get()
 *   .module(new MoleculerModule())
 *   .build()
 * ```
 * @example Register the module providing an existing Gateway Instance
 * ```typescript
 * import {ContainerBuilder} from "@tmorin/ceb-inversion-core"
 * import {MoleculerModule, MoleculerGateway} from "@tmorin/ceb-messaging-moleculer"
 * const container = ContainerBuilder.get()
 *   .module(new MoleculerModule({
 *     gateway: MoleculerGateway.GLOBAL
 *   }))
 *   .build()
 * ```
 */
export class MoleculerModule extends AbstractModule {
  private readonly options: MoleculerModuleOptions

  /**
   * @param partialOptions Options of the module.
   */
  constructor(partialOptions: Partial<MoleculerModuleOptions> = {}) {
    super()
    this.options = {
      gatewayRegistryKey: GatewaySymbol,
      eventsRegistryKey: EventBusSymbol,
      commandsRegistryKey: CommandBusSymbol,
      queriesRegistryKey: QueryBusSymbol,
      emitterRegistryKey: GatewayEmitterSymbol,
      observerRegistryKey: GatewayObserverSymbol,
      brokerRegistryKey: ServiceBrokerSymbol,
      errorToConsole: false,
      ...partialOptions,
    }
  }

  async configure(): Promise<void> {
    const broker = this.options.broker
    if (broker) {
      this.registry.registerFactory<ServiceBroker>(this.options.brokerRegistryKey, () => broker, {
        singleton: true,
      })
    }

    this.registry.registerFactory<EmittableGateway>(this.options.emitterRegistryKey, () => new GatewayEmitter(), {
      singleton: true,
    })
    this.registry.registerFactory<ObservableGateway>(
      this.options.observerRegistryKey,
      (registry) => registry.resolve<GatewayEmitter>(GatewayEmitterSymbol),
      { singleton: true }
    )
    this.registry.registerFactory<MoleculerEventBus>(
      this.options.eventsRegistryKey,
      (registry) => {
        const options: Partial<MoleculerEventBusOptions> = {
          moleculerGroup: registry.resolve<Container>(ContainerSymbol).name,
          ...this.options.eventBusOptions,
        }
        return new MoleculerEventBus(
          registry.resolve<GatewayEmitter>(this.options.emitterRegistryKey),
          registry.resolve<ServiceBroker>(this.options.brokerRegistryKey),
          options
        )
      },
      { singleton: true }
    )
    this.registry.registerFactory<MoleculerCommandBus>(
      this.options.commandsRegistryKey,
      (registry) =>
        new MoleculerCommandBus(
          registry.resolve<MoleculerEventBus>(this.options.eventsRegistryKey),
          registry.resolve<GatewayEmitter>(this.options.emitterRegistryKey),
          registry.resolve<ServiceBroker>(this.options.brokerRegistryKey)
        ),
      { singleton: true }
    )
    this.registry.registerFactory<MoleculerQueryBus>(
      this.options.queriesRegistryKey,
      (registry) =>
        new MoleculerQueryBus(
          registry.resolve<GatewayEmitter>(this.options.emitterRegistryKey),
          registry.resolve<ServiceBroker>(this.options.brokerRegistryKey)
        ),
      { singleton: true }
    )
    this.registry.registerFactory<MoleculerGateway>(
      this.options.gatewayRegistryKey,
      (registry) =>
        new MoleculerGateway(
          registry.resolve<MoleculerEventBus>(this.options.eventsRegistryKey),
          registry.resolve<MoleculerCommandBus>(this.options.commandsRegistryKey),
          registry.resolve<MoleculerQueryBus>(this.options.queriesRegistryKey),
          registry.resolve<EmittableGateway>(this.options.emitterRegistryKey)
        ),
      { singleton: true }
    )

    this.registry.registerFactory(ComponentSymbol, (registry) => ({
      configure: async () => {
        if (this.options.errorToConsole) {
          const broker = registry.resolve<ServiceBroker>(this.options.brokerRegistryKey)
          const observer: MoleculerObservableCommandBus & MoleculerObservableQueryBus & MoleculerObservableEventBus =
            registry.resolve<MoleculerGateway>(this.options.gatewayRegistryKey).observer
          // GLOBAL
          observer.on("moleculer_service_destruction_failed", ({ error, name }) => {
            broker.logger.debug(`MoleculerModule - the Moleculer service ${name} cannot be destroyed`, error.message)
          })
          // COMMAND
          observer.on("command_handler_failed", ({ command, error }) => {
            const identifier = `${command.headers.messageType}/${command.headers.messageId}`
            const message = `MoleculerModule - a command handler of ${identifier} throws an error`
            broker.logger.error(message, error)
          })
          observer.on("command_execution_failed", ({ command, error }) => {
            const identifier = `${command.headers.messageType}/${command.headers.messageId}`
            const message = `MoleculerModule - the command execution of ${identifier} throws an error`
            broker.logger.error(message, error)
          })
          observer.on("command_handler_not_found", ({ error }) => {
            broker.logger.debug("MoleculerModule - a command handler cannot be found", error.message)
          })
          // QUERY
          observer.on("query_handler_failed", ({ query, error }) => {
            const identifier = `${query.headers.messageType}/${query.headers.messageId}`
            const message = `MoleculerModule - a query handler of ${identifier} throws an error`
            broker.logger.error(message, error)
          })
          observer.on("query_execution_failed", ({ query, error }) => {
            const identifier = `${query.headers.messageType}/${query.headers.messageId}`
            const message = `MoleculerModule - the query execution of ${identifier} throws an error`
            broker.logger.error(message, error)
          })
          observer.on("query_handler_not_found", ({ error }) => {
            broker.logger.debug("MoleculerModule - a query handler cannot be found", error.message)
          })
          // EVENT
          observer.on("event_listener_failed", ({ event, error }) => {
            const identifier = `${event.headers.messageType}/${event.headers.messageId}`
            const message = `MoleculerModule - an event listener of ${identifier} throws an error`
            broker.logger.error(message, error)
          })
          observer.on("event_emitting_failed", ({ event, error }) => {
            const identifier = `${event.headers.messageType}/${event.headers.messageId}`
            const message = `MoleculerModule - the event ${identifier} cannot be emitted`
            broker.logger.error(message, error)
          })
          observer.on("event_broadcasting_failed", ({ event, error }) => {
            const identifier = `${event.headers.messageType}/${event.headers.messageId}`
            const message = `MoleculerModule - the event ${identifier} cannot be broadcast`
            broker.logger.error(message, error)
          })
        }
      },
      dispose: async () => {
        await registry.resolve<Gateway>(this.options.gatewayRegistryKey).dispose()
      },
    }))
  }
}
