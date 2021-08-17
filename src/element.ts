import {toKebabCase} from './utilities'
import {Builder, CustomElementConstructor} from './builder'
import {HookCallbacks} from './hook'

let counter = 0

/**
 * The registry of registered hooks.
 *
 * This API is dedicated for developer of Builders.
 * @protected
 */
export interface HookRegistry {
    [key: string]: {
        before: Array<Function>
        between: Array<Function>
        after: Array<Function>
    }
}

/**
 * The builder handles the definition and the registration of a Custom Element.
 *
 * By default, the builder relies on the constructor to infer the tag name of the Custom Element, c.f. {@link ElementBuilder.name}.
 *
 * If the Custom Element is a specialization of an existing `HTMLElement`,
 * then the tag name of the extended element can be provided with {@link ElementBuilder.extends}.
 *
 * The core system of `<ceb/>` is a builder of builders and in fact, `ElementBuilder` is **the builder** of builders.
 * Therefore, additional builders can be provided to it in order to enhance the built Custom Element, c.f.
 * {@link ElementBuilder.builder}.
 *
 * Finally, the registration of the Custom Element can be done with a _regular_ way using the method {@link ElementBuilder.register}.
 * However, the registration can also be done with the decorative style using the decorator {@link ElementBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class ElementBuilder<E extends HTMLElement = HTMLElement> {

    private constructor(
        private _name?: string,
        private _constructor?: CustomElementConstructor<E>,
        private _extends?: string,
        private _builders: Array<Builder<E>> = [],
        private _hooks: HookRegistry = {}
    ) {
    }

    /**
     * Get or set builder to a target from the decorators of builders.
     *
     * This API is dedicated for developer of Builders.
     * @protected
     * @param target the target
     * @param builder the builder
     * @param id the id used to identify the builder
     * @template B the type of the builder
     * @template E the type of the element
     */
    static getOrSet<B extends Builder>(
        target: Object & { _ceb_builders?: { [p: string]: B } },
        builder: B,
        id: string = `builder-${counter++}`
    ): B {
        if (!target._ceb_builders) {
            target._ceb_builders = {}
        }
        if (!target._ceb_builders[id]) {
            target._ceb_builders[id] = builder
        }
        return target._ceb_builders[id]
    }

    /**
     * Provide a fresh builder.
     * @param constructor the constructor, it's optional only when the decorator API (i.e. {@link ElementBuilder.decorate}) is used
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(constructor?: CustomElementConstructor<E>) {
        return new ElementBuilder<E>(constructor && toKebabCase(constructor.name), constructor)
    }

    /**
     * The tag name of the custom element.
     *
     * By default it is the kebab case of the class name, i.e. `HelloWorld` => `hello-world`.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin\ceb"
     *
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.textContent = `Hello, World!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld)
     *     .name("alt-hello-world")
     *     .register()
     * ```
     *
     * @param tagName the tag name
     */
    name(tagName: string) {
        this._name = tagName
        return this
    }

    /**
     * The tag name of the extended HTML element.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin\ceb"
     * class AltInput extends HTMLInputElement {
     *     constructor() {
     *         super()
     *     }
     *     connectedCallback() {
     *         this.placeholder = "Type your name!"
     *     }
     * }
     * ElementBuilder.get(AltInput)
     *     .extends("input")
     *     .register()
     * ```
     *
     * @param tagName the tag name
     */
    extends(tagName: string) {
        this._extends = tagName
        return this
    }

    /**
     * A list of builder used to enhance the CustomElement.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, ContentBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     * }
     * ElementBuilder.get(HelloWorld)
     *   .builder(ContentBuilder.get(`<p>Hello, World!</p>`))
     *   .register()
     * ```
     *
     * @param builders a list of builders
     */
    builder(...builders: Array<Builder<E>>) {
        this._builders.push.apply(this._builders, builders)
        return this
    }

    /**
     * Build and register the CustomElement.
     *
     * The output is a _wrapper class_ which extends the CustomElement class.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin\ceb"
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.textContent = `Hello, World!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).register()
     * ```
     */
    register(): CustomElementConstructor<E> {
        if (!this._name) {
            throw new TypeError("ElementBuilder - the name is missing")
        }
        if (!this._constructor) {
            throw new TypeError("ElementBuilder - the constructor is missing")
        }

        if (customElements.get(this._name)) {
            return customElements.get(this._name)
        }

        const OriginalClass = this._constructor
        const altBuilders: Array<Builder> = Object.values(OriginalClass.prototype["_ceb_builders"] || {})
        delete OriginalClass.prototype["_ceb_builders"]
        const builders = [...this._builders, ...altBuilders]
        const hooks = this

        // @ts-ignore
        const Wrapper = class CebWrapper extends OriginalClass {

            static observedAttributes: Array<string> = []

            constructor() {
                super()
                hooks.invoke('before', 'constructorCallback', callback => callback(this))
                hooks.invoke('between', 'constructorCallback', callback => callback(this))
                hooks.invoke('after', 'constructorCallback', callback => callback(this))
            }

            connectedCallback() {
                hooks.invoke('before', 'connectedCallback', callback => callback(this))
                hooks.invoke('between', 'connectedCallback', callback => callback(this))
                // @ts-ignore
                if (super['connectedCallback']) {
                    // @ts-ignore
                    super['connectedCallback']()
                }
                hooks.invoke('after', 'connectedCallback', callback => callback(this))
            }

            disconnectedCallback() {
                hooks.invoke('before', 'disconnectedCallback', callback => callback(this))
                hooks.invoke('between', 'disconnectedCallback', callback => callback(this))
                // @ts-ignore
                if (super['disconnectedCallback']) {
                    // @ts-ignore
                    super['disconnectedCallback']()
                }
                hooks.invoke('after', 'disconnectedCallback', callback => callback(this))
            }

            adoptedCallback() {
                hooks.invoke('before', 'adoptedCallback', callback => callback(this))
                hooks.invoke('between', 'adoptedCallback', callback => callback(this))
                // @ts-ignore
                if (super['adoptedCallback']) {
                    // @ts-ignore
                    super['adoptedCallback']()
                }
                hooks.invoke('after', 'adoptedCallback', callback => callback(this))
            }

            attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string) {
                hooks.invoke('before', 'attributeChangedCallback', callback => callback(this, name, oldValue, newValue))
                hooks.invoke('between', 'attributeChangedCallback', callback => callback(this, name, oldValue, newValue))
                // @ts-ignore
                if (super['attributeChangedCallback']) {
                    // @ts-ignore
                    super['attributeChangedCallback'](name, oldValue, newValue)
                }
                hooks.invoke('after', 'attributeChangedCallback', callback => callback(this, name, oldValue, newValue))
            }
        }

        builders.forEach(builder => builder.build(
            // @ts-ignore
            Wrapper,
            this
        ))

        customElements.define(this._name, Wrapper, {
            extends: this._extends
        })

        // @ts-ignore
        return Wrapper
    }

    /**
     * Decorate the Custom Element class.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin\ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     connectedCallback() {
     *         this.textContent = `Hello, World!`
     *     }
     * }
     * ```
     */
    decorate(): ClassDecorator {
        const builder = this
        // @ts-ignore
        return function (constructor: CustomElementConstructor<E>) {
            builder._constructor = constructor
            if (!builder._name) {
                builder._name = toKebabCase(constructor.name)
            }
            return builder.register()
        }
    }

    /**
     * Register a hook which will be invoked before the execution of regular hooks.
     *
     * This API is dedicated for developer of Builders.
     * @protected
     * @param name the name
     * @param callback the callback
     */
    before<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K]) {
        if (!this._hooks[name]) {
            this._hooks[name] = {
                before: [],
                between: [],
                after: []
            }
        }
        this._hooks[name].before.push(callback)
        return this
    }

    /**
     * Register a hook.
     *
     * This API is dedicated for developer of Builders.
     * @protected
     * @param name the name
     * @param callback the callback
     */
    on<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K]) {
        if (!this._hooks[name]) {
            this._hooks[name] = {
                before: [],
                between: [],
                after: []
            }
        }
        this._hooks[name].between.push(callback)
        return this
    }

    /**
     * Register a hook which will be invoked after the execution of regular hooks.
     *
     * This API is dedicated for developer of Builders.
     * @protected
     * @param name the name
     * @param callback the callback
     */
    after<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K]) {
        if (!this._hooks[name]) {
            this._hooks[name] = {
                before: [],
                between: [],
                after: []
            }
        }
        this._hooks[name].after.push(callback)
        return this
    }

    /**
     * Invokes the registered hooks.
     *
     * This API is dedicated for developer of Builders.
     * @protected
     * @param type the type
     * @param name the name
     * @param cb the callback
     */
    invoke(type: 'before' | 'between' | 'after', name: string, cb: (callback: Function) => void) {
        if (this._hooks[name]) {
            this._hooks[name][type].forEach(callback => cb(callback))
        }
    }

}
