import {Builder, CustomElementConstructor} from "../../builder";
import {HooksRegistration} from "../../hook";
import {DomBus} from "./bus";
import {ElementBuilder} from "../../element";
import {ElementSubscriptionListener, MessageEvent, MessageEventType, SubscribeOptions} from "../model";
import {toKebabCase} from "../../utilities";

/**
 * The builder handles the registration of subscriptions based on an existing method using the decorator style.
 * It should only be used from {@link DomBusBuilder.subscribe}.
 *
 * By default, the type of the Message Event is resolved from the name of the method.
 * However, it can be directly set with {@link DomBusSubscriptionBuilder.type}.
 *
 * The options of the subscription can be provided with {@link DomBusSubscriptionBuilder.options}.
 *
 * @template E the type of the Custom Element
 * @template M the type of the Message Event
 */
export class DomBusSubscriptionBuilder<E extends HTMLElement, M extends MessageEvent> {

    constructor(
        private _busBuilder: DomBusBuilder<E>,
        private _EventType?: MessageEventType<M>,
        private _listener: ElementSubscriptionListener<E, M> = () => {
        },
        private _options?: SubscribeOptions
    ) {
    }

    /**
     * Set the type of the event.
     * @param EventType the event type
     */
    type(EventType: MessageEventType<M>): DomBusSubscriptionBuilder<E, M> {
        this._EventType = EventType
        return this
    }

    /**
     * Set the listener options.
     * @param options the options
     */
    options(options: SubscribeOptions): DomBusSubscriptionBuilder<E, M> {
        this._options = options
        return this
    }

    /**
     * Decorate the listener method which is invoked when the matching Event is published.
     *
     * When the type of the Event is not specified by {@link DomBusSubscriptionBuilder.type}, then the event type is discovered from the decorated method name.
     * The pattern is `<prefix><event-type-in-kebab-case>`, where `<prefix>` is by default `on`.

     * @param prefix the prefix used to discover the type of the message event from the method name
     */
    decorate(prefix = "on"): MethodDecorator {
        return (target: Object, methName: string | symbol, descriptor: PropertyDescriptor) => {
            if (!this._EventType) {
                this._EventType = toKebabCase(
                    methName.toString().replace(prefix, '')
                )
            }
            const id = `bus-${this._busBuilder._propName}`
            const builder = ElementBuilder.getOrSet(target, this._busBuilder, id)
            if (builder !== this._busBuilder) {
                builder.mergeBuilder(this._busBuilder, false)
            }
            builder.subscribe(this._EventType, (el, event) => {
                const fn = descriptor.value as Function
                fn.call(el, event)
            }, this._options)
        }
    }

}

const BUILDERS = new WeakMap<Element, Map<string, DomBus>>()

/**
 * The builder handles the integration of the Event/Message Driven approach provided natively by `<ceb/>`.
 * Its purpose is to provide a quick and efficient way to interact with the {@link Bus} within the Custom Element.
 * Therefore, it is easy to execute queries to get data, execute commands to generate side effects and finally listen to events to react on side effects.
 *
 * First of all, the {@link Bus} is created and set to a readonly property, by default its name is `bus`.
 * By default, the global channel is `window`, it can be overridden with {@link DomBusBuilder.global}
 *
 * Then, subscriptions can be registered with {@link DomBusBuilder.subscribe}.
 * When the builder is used as a decorator, then {@link DomBusBuilder.subscribe} provides an instance of {@link DomBusSubscriptionBuilder} which can be used to easily configure a subscription.
 *
 * The bus starts when the Custom Element is connected, c.f. `connectedCallback` and, stops when it is disconnected, c.f. `disconnectedCallback`.
 *
 * The builder can be used many times by Custom Element.
 * There will be a unique {@link Bus} instance per properties.
 *
 * @template the type of the Custom Element
 */
export class DomBusBuilder<E extends HTMLElement> implements Builder<E> {

    /**
     * @ignore
     */
    public _propName: string = "bus";

    private constructor(
        _propName: string = "bus",
        private _global: EventTarget | Window = window,
        private _subscriptionsByType: Map<MessageEventType, Array<[ElementSubscriptionListener, SubscribeOptions | undefined]>> = new Map(),
    ) {
        this._propName = _propName;
    }

    /**
     * Provides a fresh builder.DomBus
     * @param propName the property name
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(propName?: string) {
        return new DomBusBuilder<E>(propName)
    }

    /**
     * Override the default global target which is `window`.
     * @param target the target
     */
    global(target: EventTarget): DomBusBuilder<E> {
        this._global = target
        return this
    }

    /**
     * Subscribe to a Message Event.
     * @param EventType the type of the event
     * @param listener the listener
     * @param options the options
     */
    subscribe<M extends MessageEvent>(EventType: MessageEventType<M>, listener: ElementSubscriptionListener<E, M>, options?: SubscribeOptions): DomBusBuilder<E>

    /**
     * When used as a decorator, returns a fresh Subscription builder to decorate a method.
     */
    subscribe<M extends MessageEvent>(): DomBusSubscriptionBuilder<E, M>

    subscribe<M extends MessageEvent>(EventType?: MessageEventType<M>, listener?: ElementSubscriptionListener<E, M>, options?: SubscribeOptions): DomBusBuilder<E> | DomBusSubscriptionBuilder<E, M> {
        if (EventType && listener) {
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
        return new DomBusSubscriptionBuilder(this)
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
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E>): void {
        const _propName = this._propName
        const _global = this._global
        const _subscriptionsByType = this._subscriptionsByType

        hooks.before('constructorCallback', el => {
            let bus: DomBus = BUILDERS.get(el)?.get(_propName) || new DomBus(_global, el)
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
            _subscriptionsByType.forEach((listeners, type) => {
                listeners.forEach(([listener, options]) => {
                    bus.subscribe(type, (event) => {
                        listener(el, event);
                    }, options);
                });
            })
        })

        hooks.before('connectedCallback', el => {
            const descriptor = Object.getOwnPropertyDescriptor(el, _propName)
            descriptor?.value?.start()
        })

        hooks.before('disconnectedCallback', el => {
            const descriptor = Object.getOwnPropertyDescriptor(el, _propName)
            descriptor?.value?.stop()
        })
    }

    /**
     * @ignore
     */
    mergeBuilder(builder: DomBusBuilder<E>, isMaster: boolean) {
        if (isMaster) {
            if (!this._propName) {
                this._propName = builder._propName
            }
            if (!this._global) {
                this._global = builder._global
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
