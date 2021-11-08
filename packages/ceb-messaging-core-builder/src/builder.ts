import {toKebabCase} from "@tmorin/ceb-utilities";
import {Builder, CustomElementConstructor, ElementBuilder, HooksRegistration} from "@tmorin/ceb-core";
import {MessageEvent, MessageType} from "@tmorin/ceb-messaging-core";
import {Bus, SubscribeOptions, Subscription} from "@tmorin/ceb-messaging-core";

/**
 * The listener of a subscription.
 */
export interface ElementSubscriptionListener<E extends HTMLElement = HTMLElement, M extends MessageEvent = MessageEvent> {
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
 * It should only be used from {@link AbstractBusBuilder.subscribe}.
 *
 * By default, the type of the Message Event is resolved from the name of the method.
 * However, it can be directly set with {@link BusSubscriptionBuilder.type}.
 *
 * The options of the subscription can be provided with {@link BusSubscriptionBuilder.options}.
 *
 * @template E the type of the Custom Element
 * @template M the type of the Message Event
 */
export class BusSubscriptionBuilder<E extends HTMLElement, M extends MessageEvent> {

    constructor(
        private _busBuilder: AbstractBusBuilder<E>,
        private _eventType?: MessageType,
        private _listener: ElementSubscriptionListener<E, M> = () => {
        },
        private _options?: SubscribeOptions
    ) {
    }

    /**
     * Set the type of the event.
     * @param eventType the event type
     */
    type(eventType: MessageType): BusSubscriptionBuilder<E, M> {
        this._eventType = eventType
        return this
    }

    /**
     * Set the listener options.
     * @param options the options
     */
    options(options: SubscribeOptions): BusSubscriptionBuilder<E, M> {
        this._options = options
        return this
    }

    /**
     * Decorate the listener method which is invoked when the matching Event is published.
     *
     * When the type of the Event is not specified by {@link BusSubscriptionBuilder.type}, then the event type is discovered from the decorated method name.
     * The pattern is `<prefix><event-type-in-kebab-case>`, where `<prefix>` is by default `on`.

     * @param prefix the prefix used to discover the type of the message event from the method name
     */
    decorate(prefix = "on"): MethodDecorator {
        return (target: Object, methName: string | symbol, descriptor: PropertyDescriptor) => {
            if (!this._eventType) {
                this._eventType = toKebabCase(
                    methName.toString().replace(prefix, '')
                )
            }
            const id = `bus-${this._busBuilder._propName}`
            const builder = ElementBuilder.getOrSet(target, this._busBuilder, id)
            if (builder !== this._busBuilder) {
                builder.mergeBuilder(this._busBuilder, false)
            }
            builder.subscribe(this._eventType, (el, event) => {
                const fn = descriptor.value as Function
                fn.call(el, event)
            }, this._options)
        }
    }

}

/**
 * Factory of a bus.
 */
export interface BusProvider {
    /**
     * @return the bus
     */
    (): Bus
}

const BUILDERS = new WeakMap<Element, Map<string, Bus>>()

/**
 * The builder handles the integration of the Event/Message Driven approach provided natively by `<ceb/>`.
 * Its purpose is to provide a quick and efficient way to interact with the {@link Bus} within the Custom Element.
 * Therefore, it is easy to execute queries to get data, execute commands to generate side effects and finally listen to events to react on side effects.
 *
 * First of all, the {@link Bus} is created and set to a readonly property, by default its name is `bus`.
 * By default, the global channel is `window`, it can be overridden with {@link AbstractBusBuilder.global}
 *
 * Then, subscriptions can be registered with {@link AbstractBusBuilder.subscribe}.
 * When the builder is used as a decorator, then {@link AbstractBusBuilder.subscribe} provides an instance of {@link BusSubscriptionBuilder} which can be used to easily configure a subscription.
 *
 * The bus starts when the Custom Element is connected, c.f. `connectedCallback` and, stops when it is disconnected, c.f. `disconnectedCallback`.
 *
 * The builder can be used many times by Custom Element.
 * There will be a unique {@link Bus} instance per properties.
 *
 * @template the type of the Custom Element
 */
export abstract class AbstractBusBuilder<E extends HTMLElement> implements Builder<E> {

    /**
     * @ignore
     */
    public _propName: string = "bus";

    protected constructor(
        protected _busProvider: BusProvider,
        _propName: string = "bus",
        protected _subscriptionsByType: Map<MessageType, Array<[ElementSubscriptionListener, SubscribeOptions | undefined]>> = new Map(),
    ) {
        this._propName = _propName;
    }

    /**
     * Subscribe to a Message Event.
     * @param eventType the type of the event
     * @param listener the listener
     * @param options the options
     */
    subscribe<M extends MessageEvent>(
        eventType: MessageType,
        listener: ElementSubscriptionListener<E, M>,
        options ?: SubscribeOptions
    ): AbstractBusBuilder<E>

    /**
     * When used as a decorator, returns a fresh Subscription builder to decorate a method.
     */
    subscribe<M extends MessageEvent>(): BusSubscriptionBuilder<E, M>

    subscribe<M extends MessageEvent>(
        eventType ?: MessageType,
        listener ?: ElementSubscriptionListener<E, M>,
        options ?: SubscribeOptions
    ): AbstractBusBuilder<E> | BusSubscriptionBuilder<E, M> {
        if (eventType && listener
        ) {
            if (!this._subscriptionsByType.has(eventType)) {
                this._subscriptionsByType.set(eventType, [])
            }
            this._subscriptionsByType.get(eventType)?.push([
                // @ts-ignore
                listener,
                options
            ])
            return this
        }
        return new BusSubscriptionBuilder(this)
    }

    /**
     * Decorates the property of the bus.
     */
    decorate(): PropertyDecorator {
        return (target, propName) => {
            this._propName = propName.toString()
            const id = `bus-${this._propName}`
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
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E & { __ceb_bus_subscriptions: Set<Subscription> }>): void {
        const _propName = this._propName
        const _subscriptionsByType = this._subscriptionsByType

        hooks.before('constructorCallback', el => {
            const bus = this._busProvider()
            if (!BUILDERS.get(el)?.has(_propName)) {
                BUILDERS.set(el, new Map([[_propName, bus]]))
            }
            if (!Object.getOwnPropertyDescriptor(el, _propName)) {
                Object.defineProperty(el, _propName, {
                    value: bus,
                    configurable: false,
                    writable: false,
                    enumerable: true
                })
            }
            el.__ceb_bus_subscriptions = new Set<Subscription>()
        })

        hooks.before('connectedCallback', el => {
            const busDescriptor = Object.getOwnPropertyDescriptor(el, _propName)
            _subscriptionsByType.forEach((listeners, type) =>
                listeners.forEach(([listener, options]) =>
                    el.__ceb_bus_subscriptions.add(busDescriptor?.value?.subscribe(type, (event: MessageEvent) => listener(el, event), options))))
        })

        hooks.before('disconnectedCallback', el => {
            el.__ceb_bus_subscriptions.forEach(subscription => subscription.unsubscribe())
            el.__ceb_bus_subscriptions.clear()
        })
    }

    /**
     * @ignore
     */
    mergeBuilder(builder: AbstractBusBuilder<E>, isMaster: boolean) {
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
