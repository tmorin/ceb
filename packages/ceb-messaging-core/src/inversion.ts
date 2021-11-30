import {
  AbstractModule,
  Component,
  ComponentSymbol,
  Container,
  ContainerSymbol,
  RegistryKey,
} from "@tmorin/ceb-inversion-core"
import { Command, CommandHandler } from "./command"
import { Result } from "./result"
import { Event, EventListener } from "./event"
import { Query, QueryHandler } from "./query"
import { Removable } from "./common"
import { Gateway, GatewaySymbol } from "./gateway"

// COMMAND

/**
 * The symbol used to register {@link DiscoverableCommandHandler}.
 */
export const DiscoverableCommandHandlerSymbol = Symbol.for("ceb/inversion/DiscoverableCommandHandler")

/**
 * A command handler discovered by the container on startup.
 *
 * @template C the type of the Command
 * @template R the type of the Result
 * @template Es the type of the Events
 */
export type DiscoverableCommandHandler<
  C extends Command = Command,
  R extends Result = Result,
  Es extends Array<Event> = []
> = {
  type: string
  handler: CommandHandler<C, R, Es>
}

// QUERY

/**
 * The symbol used to register {@link DiscoverableQueryHandler}.
 */
export const DiscoverableQueryHandlerSymbol = Symbol.for("ceb/inversion/DiscoverableQueryHandler")

/**
 * A query handler discovered by the container on startup.
 *
 * @template Q the type of the Query
 * @template R the type of the Result
 */
export type DiscoverableQueryHandler<Q extends Query = Query, R extends Result = Result> = {
  type: string
  handler: QueryHandler<Q, R>
}

// LISTENER

/**
 * The symbol used to register {@link DiscoverableEventListener}.
 */
export const DiscoverableEventListenerSymbol = Symbol.for("ceb/inversion/DiscoverableEventListener")

/**
 * An event handler discovered by the container on startup.
 *
 * @template E the type of the Event
 */
export type DiscoverableEventListener<E extends Event = Event> = {
  type: string
  listener: EventListener<E>
}

// COMPONENT

/**
 * The component discovers the handlers (for commands and queries) as well as the listeners in the registry and then register them to the bus.
 *
 * - The command handlers are discovered with the key {@link DiscoverableCommandHandlerSymbol}.
 * - The query handlers are discovered with the key {@link DiscoverableQueryHandlerSymbol}.
 * - The event listeners are discovered with the key {@link DiscoverableEventListenerSymbol}.
 *
 * The registrations are done when the container starts.
 * They are also disposed once the container is disposed too.
 */
export class MessagingComponent extends Component {
  private readonly removableList: Array<Removable> = []

  constructor(
    /**
     * The container.
     */
    private readonly container: Container,
    /**
     * The gateway.
     */
    private readonly gateway: Gateway
  ) {
    super()
  }

  async configure(): Promise<void> {
    if (this.container.registry.contains(DiscoverableCommandHandlerSymbol)) {
      this.container.registry
        .resolveAll<DiscoverableCommandHandler>(DiscoverableCommandHandlerSymbol)
        .forEach((entry) => {
          this.removableList.push(this.gateway.commands.handle(entry.type, entry.handler))
        })
    }

    if (this.container.registry.contains(DiscoverableQueryHandlerSymbol)) {
      this.container.registry.resolveAll<DiscoverableQueryHandler>(DiscoverableQueryHandlerSymbol).forEach((entry) => {
        this.removableList.push(this.gateway.queries.handle(entry.type, entry.handler))
      })
    }

    if (this.container.registry.contains(DiscoverableEventListenerSymbol)) {
      this.container.registry
        .resolveAll<DiscoverableEventListener>(DiscoverableEventListenerSymbol)
        .forEach((entry) => {
          this.removableList.push(this.gateway.events.subscribe(entry.type, entry.listener))
        })
    }
  }

  async dispose(): Promise<void> {
    let removable
    while ((removable = this.removableList.pop())) {
      removable.remove()
    }
  }
}

// MODULE

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
