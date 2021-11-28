import {Builder, CustomElementConstructor, ElementBuilder, HooksRegistration} from "@tmorin/ceb-elements-core";
import {Event, Gateway, MessageType, Removable, SubscribeOptions} from "@tmorin/ceb-messaging-core";

/**
 * The listener of a subscription.
 */
export interface ElementSubscriptionListener<E extends HTMLElement = HTMLElement, M extends Event = Event> {
    /**
     * @param el the Custom Element
     * @param event the message
     * @template E the type of the Custom Element
     * @template M the type of the Event Message
     */
    (el: E, event: M): void
}

/**
 * The builder handles the registration of subscriptions based on an existing method using the decorator style.
 * It should only be used from {@link AbstractGatewayBuilder.subscribe}.
 *
 * By default, the type of the Message Event is resolved from the name of the method.
 * However, it can be directly set with {@link GatewaySubscriptionBuilder.type}.
 *
 * The options of the subscription can be provided with {@link GatewaySubscriptionBuilder.options}.
 *
 * @template E the type of the Custom Element
 * @template M the type of the Message Event
 */
export class GatewaySubscriptionBuilder<E extends HTMLElement, M extends Event> {

    constructor(
        private _gatewayBuilder: AbstractGatewayBuilder<E>,
        private _EventType?: MessageType,
        private _listener: ElementSubscriptionListener<E, M> = () => {
        },
        private _options?: SubscribeOptions
    ) {
    }

    /**
     * Set the type of the event.
     * @param EventType the event type
     */
    type(EventType: MessageType): GatewaySubscriptionBuilder<E, M> {
        this._EventType = EventType
        return this
    }

    /**
     * Set the listener options.
     * @param options the options
     */
    options(options: SubscribeOptions): GatewaySubscriptionBuilder<E, M> {
        this._options = options
        return this
    }

    /**
     * Decorate the listener method which is invoked when the matching Event is published.
     *
     * When the type of the Event is not specified by {@link GatewaySubscriptionBuilder.type}, then the event type is discovered from the decorated method name.
     * The pattern is `<prefix><event-type>`, where `<prefix>` is by default `on`.
     *
     * @param prefix the prefix used to discover the type of the message event from the method name
     */
    decorate(prefix = "on"): MethodDecorator {
        return (target: Object, methName: string | symbol, descriptor: PropertyDescriptor) => {
            if (!this._EventType) {
                this._EventType = methName.toString().replace(prefix, '')
            }
            const id = `gateway-${this._gatewayBuilder._propName}`
            const builder = ElementBuilder.getOrSet(target, this._gatewayBuilder, id)
            if (builder !== this._gatewayBuilder) {
                builder.mergeBuilder(this._gatewayBuilder, false)
            }
            builder.subscribe(this._EventType, (el, event) => {
                const fn = descriptor.value as Function
                fn.call(el, event)
            }, this._options)
        }
    }

}

/**
 * Factory of a gateway.
 */
export interface GatewayProvider {
    /**
     * @return the gateway
     */
    (): Gateway
}

const BUILDERS = new WeakMap<Element, Map<string, Gateway>>()

/**
 * The builder handles the integration of the Event/Message Driven approach provided natively by `<ceb/>`.
 * Its purpose is to provide a quick and efficient way to interact with the {@link Gateway} within the Custom Element.
 * Therefore, it is easy to execute queries to get data, execute commands to generate side effects and finally listen to events to react on side effects.
 *
 * First of all, the {@link Gateway} is created and set to a readonly property, by default its name is `gateway`.
 * By default, the global channel is `window`, it can be overridden with {@link AbstractGatewayBuilder.global}
 *
 * Then, subscriptions can be registered with {@link AbstractGatewayBuilder.subscribe}.
 * When the builder is used as a decorator, then {@link AbstractGatewayBuilder.subscribe} provides an instance of {@link GatewaySubscriptionBuilder} which can be used to easily configure a subscription.
 *
 * The gateway starts when the Custom Element is connected, c.f. `connectedCallback` and, stops when it is disconnected, c.f. `disconnectedCallback`.
 *
 * The builder can be used many times by Custom Element.
 * There will be a unique {@link Gateway} instance per properties.
 *
 * @template the type of the Custom Element
 */
export abstract class AbstractGatewayBuilder<E extends HTMLElement> implements Builder<E> {

    /**
     * @ignore
     * @internal
     */
    public _propName: string = "gateway";

    protected constructor(
        protected _gatewayProvider: GatewayProvider,
        _propName: string = "gateway",
        protected _subscriptionsByType: Map<MessageType, Array<[ElementSubscriptionListener, SubscribeOptions | undefined]>> = new Map(),
    ) {
        this._propName = _propName;
    }

    /**
     * Subscribe to a Message Event.
     * @param EventType the type of the event
     * @param listener the listener
     * @param options the options
     */
    subscribe<M extends Event>(
        EventType: MessageType,
        listener: ElementSubscriptionListener<E, M>,
        options ?: SubscribeOptions
    ): AbstractGatewayBuilder<E>

    /**
     * When used as a decorator, returns a fresh Subscription builder to decorate a method.
     */
    subscribe<M extends Event>(): GatewaySubscriptionBuilder<E, M>

    subscribe<M extends Event>(
        EventType ?: MessageType,
        listener ?: ElementSubscriptionListener<E, M>,
        options ?: SubscribeOptions
    ): AbstractGatewayBuilder<E> | GatewaySubscriptionBuilder<E, M> {
        if (EventType && listener
        ) {
            if (!this._subscriptionsByType.has(EventType)) {
                this._subscriptionsByType.set(EventType, [])
            }
            this._subscriptionsByType.get(EventType)?.push([
                // @ts-ignore
                listener,
                options
            ])
            return this
        }
        return new GatewaySubscriptionBuilder(this)
    }

    /**
     * Decorates the property of the gateway.
     */
    decorate(): PropertyDecorator {
        return (target, propName) => {
            this._propName = propName.toString()
            const id = `gateway-${this._propName}`
            const builder = ElementBuilder.getOrSet(target, this, id)
            if (builder !== this) {
                builder.mergeBuilder(this, true)
            }
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E & { __ceb_gateway_subscriptions: Set<Removable> }>): void {
        const _propName = this._propName
        const _subscriptionsByType = this._subscriptionsByType

        hooks.before('constructorCallback', el => {
            const gateway = this._gatewayProvider()
            if (!BUILDERS.get(el)?.has(_propName)) {
                BUILDERS.set(el, new Map([[_propName, gateway]]))
            }
            if (!Object.getOwnPropertyDescriptor(el, _propName)) {
                Object.defineProperty(el, _propName, {
                    value: gateway,
                    configurable: false,
                    writable: false,
                    enumerable: true
                })
            }
            el.__ceb_gateway_subscriptions = new Set<Removable>()
        })

        hooks.before('connectedCallback', el => {
            const gatewayDescriptor = Object.getOwnPropertyDescriptor(el, _propName)
            _subscriptionsByType.forEach((listeners, type) =>
                listeners.forEach(([listener, options]) =>
                    el.__ceb_gateway_subscriptions.add(gatewayDescriptor?.value?.events.subscribe(
                        type,
                        (event: Event) => listener(el, event), options)
                    )))
        })

        hooks.before('disconnectedCallback', el => {
            el.__ceb_gateway_subscriptions.forEach(subscription => subscription.remove())
            el.__ceb_gateway_subscriptions.clear()
        })
    }

    /**
     * @ignore
     */
    mergeBuilder(builder: AbstractGatewayBuilder<E>, isMaster: boolean) {
        if (isMaster) {
            if (!this._propName) {
                this._propName = builder._propName
            }
            builder._subscriptionsByType.forEach((subscription, type) => {
                if (!this._subscriptionsByType.has(type)) {
                    this._subscriptionsByType.set(type, subscription)
                } else {
                    subscription.forEach(entry => this._subscriptionsByType.get(type)?.push(entry))
                }
            })
        } else {
            this._subscriptionsByType.forEach((subscription, type) => {
                if (!builder._subscriptionsByType.has(type)) {
                    builder._subscriptionsByType.set(type, subscription)
                } else {
                    subscription.forEach(entry => builder._subscriptionsByType.get(type)?.push(entry))
                }
            })
        }
    }

}
