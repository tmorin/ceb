import {Builder, CustomElementConstructor, ElementBuilder, HooksRegistration} from "@tmorin/ceb-core"
import {toKebabCase} from "@tmorin/ceb-utilities";

/**
 * The event listener is invoked according to the clauses.
 */
export interface OnListener<E extends HTMLElement = HTMLElement, V extends Event = Event, T extends Element = Element> {
    /**
     * @param el the Custom Element
     * @param evt the DOM event
     * @param targetClause the target of the clause otherwise, the Custom Element
     * @template E the type of the Custom Element
     * @template V the type of the Event
     * @template T the type of the target
     */
    (el: E, evt: V, targetClause: T): void
}

/**
 * A useless function.
 */
const noop = () => {
}

/**
 * Event clauses `[[<name>,<selector>]]` => `[['click', 'button'], ['click', 'a.button']]`.
 */
type Clauses = Array<[string, string | undefined]>

/**
 * Select a target.
 */
export interface TargetSelector<E extends HTMLElement> {
    /**
     * @param el The Custom Element
     * @template E the type of the Custom Element
     */
    (el: E): EventTarget
}

/**
 * The builder handles the addition and removal of DOM event listeners.
 *
 * The DOM event listeners are simple callback functions, c.f. {@link OnListener}.
 * They can be registered with {@link OnBuilder.invoke}.
 * The registered event listeners are added on `connectedCallback` and removed on `disconnectedCallback`.
 *
 * The DOM event listeners are invoked according to provided clauses.
 * A clause is an event name to which an optional CSS selector can be associate.
 * The pattern is `EVENT_NAME <CSS_SELECTOR>`.
 * For instance, the clause `click` adds an event listener to the node of the Custom Element and, listen to `click`.
 * About the optional CSS selector, it is way to add the event listener to a child node of the Custom Element.
 * For instance, the clause `click div button` adds an event listener to the node which matches the CSS selector `div button`.
 *
 * Alternatively, {@link OnBuilder.target} can also be used to specify the _target_.
 * Moreover, it can also be used to listen to global events.
 * For instance, the `hashchange` events dispatched on `window`.
 *
 * The event listeners can be configured to be invoked on the capture phase with {@link OnBuilder.capture}.
 *
 * Once the event is received, its method `preventDefault()` can be dynamically invoked with {@link OnBuilder.prevent}.
 * The method `stopPropagation()` can also be dynamically invoked with {@link OnBuilder.stop}.
 * Both methods can be dynamically invoked with {@link OnBuilder.skip}.
 *
 * The event delegation (c.f. jQuery) can be configured with {@link OnBuilder.delegate}.
 *
 * By default the CSS selectors are applied to the Light DOM.
 * However, they can be applied into the Shadow DOM with {@link OnBuilder.shadow}.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link OnBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class OnBuilder<E extends HTMLElement = HTMLElement> implements Builder<E> {

    private constructor(
        private _clauses?: string,
        private _target?: TargetSelector<E>,
        private _callback: OnListener = noop,
        private _forceCapture = false,
        private _forcePreventDefault = false,
        private _forceStopPropagation = false,
        private _selector?: string,
        private _isShadow = false
    ) {
    }

    /**
     * Provide a fresh builder.
     *
     * @param clauses the clauses separated by `,`, it's optional only when the decorator API (i.e. {@link OnBuilder.decorate}) is used
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(clauses?: string) {
        return new OnBuilder<E>(clauses)
    }

    /**
     * Override the default target, for instance to listen to global events, i.e. `window.document` or `window.document`.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("hashchange").from(window)
     * ).register()
     * ```
     */
    from(target: EventTarget | TargetSelector<E>) {
        this._target = typeof target === "function" ? target : () => target
        return this
    }

    /**
     * Force the listener execution on the capture phase.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("click").capture()
     * ).register()
     * ```
     */
    capture() {
        this._forceCapture = true
        return this
    }

    /**
     * Register the listener.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("click")
     *         .invoke((el, data) => console.info(`Hello, World!`))
     * ).register()
     * ```
     *
     * @param listener the callback
     * @template V the type of the Event
     * @template T the type of the target
     */
    invoke<V extends Event = Event, T extends Element = Element>(listener: OnListener<E, V, T>) {
        // @ts-ignore
        this._callback = listener
        return this
    }

    /**
     * Force the usage of `preventDefault()` once the event is received.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("click").prevent()
     * ).register()
     * ```
     */
    prevent() {
        this._forcePreventDefault = true
        return this
    }

    /**
     * Force the usage of `stopPropagation()` once the event is received.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("click").stop()
     * ).register()
     * ```
     */
    stop() {
        this._forceStopPropagation = true
        return this
    }

    /**
     * Apply `.prevent()` and `.stop()` at the same time.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("click").skip()
     * ).register()
     * ```
     */
    skip() {
        return this.prevent().stop()
    }

    /**
     * Event delegation allows us to attach a single event listener, to a parent element,
     * that will fire for all descendants matching a CSS selector,
     * whether those descendants exist now or are added in the future.
     * [c.f. the jQuery doc](https://learn.jquery.com/events/event-delegation)
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("click").delegate("button")
     * ).register()
     * ```
     *
     * @param selector the CSS selector
     */
    delegate(selector: string) {
        this._selector = selector
        return this
    }

    /**
     * By default, the selection of the target element is done in the light DOM.
     * This option forces the selection into the shadow DOM.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.attachShadow({mode: "open"})
     *         this.shadowRoot.innerHTML = `<button>Click here</button>`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     OnBuilder.get("click button").shadow()
     * ).register()
     * ```
     */
    shadow() {
        this._isShadow = true
        return this
    }

    /**
     * Decorate the listener method which is invoked according to the clauses.
     *
     * When the clause is not specified by {@link OnBuilder.get}, then the event name to listen to is discovered from the decorated method name.
     * The pattern is `<prefix><event-name-in-kebab-case>`, where `<prefix>` is by default `on`.
     *
     * @example Discovery of the event name
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     *     @OnBuilder.get().decorate()
     *     onClick(evt) {
     *         console.info(`Hello, World!`)
     *     }
     * }
     * ```
     *
     * @example Discovery of the event name with a custom prefix
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     *     @OnBuilder.get().decorate("listen")
     *     listenClick(evt) {
     *         console.info(`Hello, World!`)
     *     }
     * }
     * ```
     *
     * @example Skip the attribute name discovery
     * ```typescript
     * import {ElementBuilder, OnBuilder} from "@tmorin\ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.innerHTML = `<button>Click here</button>`
     *     }
     *     @OnBuilder.get("click").decorate("listen")
     *     foo(evt) {
     *         console.info(`Hello, World!`)
     *     }
     * }
     * ```
     *
     * @param prefix the prefix used to discover the event name from the method name
     */
    decorate(prefix = "on"): MethodDecorator {
        return (target: Object, methName: string | symbol, descriptor: PropertyDescriptor) => {
            if (!this._clauses) {
                this._clauses = toKebabCase(
                    methName.toString().replace(prefix, '')
                )
            }
            ElementBuilder.getOrSet(target, this).invoke((el, data, target) => {
                const fn = descriptor.value as Function
                fn.call(el, data, target)
            })
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E & { __ceb_on_handlers: Array<any> }>) {
        if (!this._clauses) {
            throw new TypeError("OnBuilder - the clauses are missing")
        }

        const clauses: Clauses = this._clauses.split(",").map(clause => {
            const parts = clause.trim().split(" ")
            const name = parts[0]
            const target = parts.length > 1 ? parts.slice(1).join(" ") : undefined
            return [name, target]
        })
        const capture = this._forceCapture
        const callback = this._callback
        const selector = this._selector
        const stopPropagation = this._forceStopPropagation
        const preventDefault = this._forcePreventDefault

        hooks.before('connectedCallback', el => {
            const base = this._isShadow ? el.shadowRoot : el
            if (!base) {
                return
            }

            const listener = (evt: Event) => {
                if (selector) {
                    const target = Array.from(base.querySelectorAll(selector)).filter((candidate: Element) => {
                        const isTarget = candidate === evt.target
                        const isChild = evt.target instanceof Node && candidate.contains(evt.target)
                        return isTarget || isChild
                    })[0]
                    if (target) {
                        if (stopPropagation) {
                            evt.stopPropagation()
                        }
                        if (preventDefault) {
                            evt.preventDefault()
                        }
                        callback(el, evt, target)
                    }
                } else {
                    if (stopPropagation) {
                        evt.stopPropagation()
                    }
                    if (preventDefault) {
                        evt.preventDefault()
                    }
                    callback(
                        el,
                        evt,
                        // @ts-ignore
                        el
                    )
                }
            }

            el.__ceb_on_handlers = clauses
                .map(([name, target]) => {
                    const oTarget = target
                        ? base.querySelector(target)
                        : this._target
                            ? this._target(el)
                            : base
                    return [name, oTarget];
                })
                .filter(([, target]) => !!target)
                .map(([name, target]) => [target, name, listener, capture])
                .concat(el.__ceb_on_handlers || [])

            el.__ceb_on_handlers.forEach(([target, name, listener, capture]) => {
                target.addEventListener(name, listener, capture)
            })
        })

        hooks.before('disconnectedCallback', el => {
            el.__ceb_on_handlers.forEach(
                ([target, name, listener, capture]) => target.removeEventListener(name, listener, capture)
            )
            el.__ceb_on_handlers = []
        })
    }

}
