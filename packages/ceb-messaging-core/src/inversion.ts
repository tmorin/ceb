import {AbstractModule, Component, ComponentSymbol, Container, ContainerSymbol} from "@tmorin/ceb-inversion";
import {MessageCommand, MessageConstructor, MessageEvent, MessageQuery, MessageResult, MessageType} from "./message";
import {Bus, BusSymbol, Handler, Subscription} from "./bus";

// COMMAND

/**
 * The symbol used to register {@link MessageCommandHandler}.
 */
export const MessageCommandHandlerSymbol = Symbol.for("ceb/inversion/MessageCommandHandler")

/**
 * A command handler handles a command.
 *
 * @template C the type of the MessageCommand
 * @template R the type of the MessageResult
 * @template E the type of the MessageEvents
 */
export interface MessageCommandHandler<C extends MessageCommand = MessageCommand,
    R extends MessageResult = MessageResult,
    E extends MessageEvent = MessageEvent> {
    CommandType: MessageType | MessageConstructor<C>
    ResultType: MessageConstructor<R>

    handle(command: C): Promise<void | R | [R | void, Array<E>]>
}

// QUERY

/**
 * The symbol used to register {@link MessageQueryHandler}.
 */
export const MessageQueryHandlerSymbol = Symbol.for("ceb/inversion/MessageQueryHandler")

/**
 * A query handler handles a query.
 *
 * @template Q the type of the MessageQuery
 * @template R the type of the MessageResult
 */
export interface MessageQueryHandler<Q extends MessageQuery = MessageQuery,
    R extends MessageResult = MessageResult> {
    QueryType: MessageType | MessageConstructor<Q>
    ResultType: MessageType | MessageConstructor<R>

    handle(query: Q): Promise<void | R>
}

// LISTENER

/**
 * The symbol used to register {@link MessageEventListener}.
 */
export const MessageEventListenerSymbol = Symbol.for("ceb/inversion/MessageEventListener")

/**
 * A event listener listen to an event.
 *
 * @template E the type of the MessageEvent
 */
export interface MessageEventListener<E extends MessageEvent = MessageEvent> {
    EventType: MessageType | MessageConstructor<E>

    on(event: E): Promise<void>
}

// COMPONENT

/**
 * The component discovers the handlers (for commands and queries) as well as the listeners in the registry and then register them to the bus.
 *
 * - The command handlers are discovered with the key {@link MessageCommandHandlerSymbol}.
 * - The query handlers are discovered with the key {@link MessageQueryHandlerSymbol}.
 * - The event listeners are discovered with the key {@link MessageEventListenerSymbol}.
 *
 * The registrations are done when the container starts.
 * They are also disposed once the container is disposed too.
 */
export class MessagingComponent extends Component {

    private readonly handlers: Array<Handler> = []

    private readonly subscriptions: Array<Subscription> = []

    constructor(
        /**
         * The container.
         */
        private readonly container: Container,
        /**
         * The bus.
         */
        private readonly bus: Bus
    ) {
        super();
    }

    async configure(): Promise<void> {

        if (this.container.registry.contains(MessageCommandHandlerSymbol)) {
            const messageCommandHandlers = this.container.registry.resolveAll<MessageCommandHandler>(MessageCommandHandlerSymbol)
            this.handlers.push.apply(this, messageCommandHandlers.map(handler => this.bus.handle(
                handler.CommandType,
                handler.ResultType,
                async (command) => {
                    const output = await handler.handle(command)
                    if (Array.isArray(output)) {
                        const result = output[0]
                        const events = output[1] || []
                        events.forEach(event => this.bus.publish(event))
                        return result
                    } else {
                        return output
                    }
                }))
            )
        }

        if (this.container.registry.contains(MessageQueryHandlerSymbol)) {
            const messageQueryHandlers = this.container.registry.resolveAll<MessageQueryHandler>(MessageQueryHandlerSymbol)
            this.handlers.push.apply(this, messageQueryHandlers.map(handler => this.bus.handle(
                handler.QueryType,
                handler.ResultType,
                async (query) => handler.handle(query)))
            )
        }

        if (this.container.registry.contains(MessageEventListenerSymbol)) {
            const messageEventListeners = this.container.registry.resolveAll<MessageEventListener>(MessageEventListenerSymbol)
            this.subscriptions.push.apply(this, messageEventListeners.map(handler => this.bus.subscribe(
                handler.EventType,
                async (query) => {
                    try {
                        await handler.on(query)
                    } catch (error: any) {
                        console.error("MessagingComponent - an event listener failed", error)
                    }
                }))
            )
        }

    }

    async dispose(): Promise<void> {
        let handler
        while (handler = this.handlers.pop()) {
            handler.cancel()
        }

        let subscription
        while (subscription = this.subscriptions.pop()) {
            subscription.unsubscribe()
        }
    }

}

// MODULE

/**
 * The module register the component {@link MessagingComponent} in order to discover and bootstrap handlers and listeners.
 *
 * The module expects to resolve a {@link Bus} bound with the key {@link BusSymbol}.
 *
 * @example Register the MessagingModule
 * ```typescript
 * import {inversion, messaging} from "@tmorin/ceb"
 * const container = inversion.ContainerBuilder.get()
 *   .module(new messaging.MessagingModule())
 *   .build()
 * ```
 */
export class MessagingModule extends AbstractModule {
    async configure(): Promise<void> {
        this.registry.registerFactory(ComponentSymbol, registry => new MessagingComponent(
            registry.resolve<Container>(ContainerSymbol),
            registry.resolve<Bus>(BusSymbol),
        ))
    }
}
