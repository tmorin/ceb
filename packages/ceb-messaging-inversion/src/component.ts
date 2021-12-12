import { Component, Container } from "@tmorin/ceb-inversion-core"
import { Gateway, Removable } from "@tmorin/ceb-messaging-core"
import { DiscoverableCommandHandler, DiscoverableCommandHandlerSymbol } from "./command"
import { DiscoverableQueryHandler, DiscoverableQueryHandlerSymbol } from "./query"
import { DiscoverableEventListener, DiscoverableEventListenerSymbol } from "./event"

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
          this.removableList.push(this.gateway.commands.handle(entry.type, entry.handler.bind(entry)))
        })
    }

    if (this.container.registry.contains(DiscoverableQueryHandlerSymbol)) {
      this.container.registry.resolveAll<DiscoverableQueryHandler>(DiscoverableQueryHandlerSymbol).forEach((entry) => {
        this.removableList.push(this.gateway.queries.handle(entry.type, entry.handler.bind(entry)))
      })
    }

    if (this.container.registry.contains(DiscoverableEventListenerSymbol)) {
      this.container.registry
        .resolveAll<DiscoverableEventListener>(DiscoverableEventListenerSymbol)
        .forEach((entry) => {
          this.removableList.push(this.gateway.events.subscribe(entry.type, entry.listener.bind(entry)))
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
