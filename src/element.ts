
import {toKebabCase} from './utilities'
import {Builder, CustomElementConstructor} from './builder'
import {HookCallbacks, HooksRegistration} from './hook'

/**
 * @module
 * @category Builder
 */


/**
 * The registry of registered hooks.
 *
 * The is API is dedicated for developer of Builders.
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
 * The options of the decorator {@link ElementBuilder.element}.
 * @template T The type of the Custom Element.
 */
export type ElementDecoratorOptions<T extends HTMLElement> = {
    /**
     * Override the name of the custom element.
     */
    name?: string,
    /**
     * Set the extended HTML element.
     */
    extends?: string,
    /**
     * Set a pre-configured builder.
     */
    builder?: ElementBuilder<T>
}

const PROPERTY_NAME_BUILDERS = "_ceb_builders"

/**
 * The builder provides services to define and register CustomElement.
 *
 * @example With the decorator API - Register an element
 * ```typescript
 * import {ElementBuilder} from "ceb"
 * @ElementBuilder.element<HelloWorld>()
 * class HelloWorld extends HTMLElement {
 *     connectedCallback() {
 *         this.textContent = "Hello, World!"
 *     }
 * }
 * ```
 * @example With the decorator API - Register a specialization of HTMLInputElement
 * ```typescript
 * import {ElementBuilder} from "ceb"
 * @ElementBuilder.element<MyInput>({
 *     extends: "input",
 *     name: "x-input"
 * })
 * class MyInput extends HTMLInputElement {
 *     connectedCallback() {
 *         this.placeholder = "Type your name!"
 *     }
 * }
 * ```
 *
 * @template T The type of the Custom Element.
 */
export class ElementBuilder<T extends HTMLElement> implements HooksRegistration {

    private constructor(
        private elName: string,
        private elConstructor: CustomElementConstructor<T>,
        private elExtends?: string,
        private builders: Array<Builder> = [],
        private hooks: HookRegistry = {}
    ) {
    }

    /**
     * Get or set builder to a target.
     *
     * The is API is dedicated for developer of Builders.
     * @protected
     * @param target the target
     * @param id the id used to identify the builder
     * @param builder the builder
     */
    static getOrSet<B extends Builder>(target: HTMLElement, id: string, builder: B): B {
        if (!target[PROPERTY_NAME_BUILDERS]) {
            target[PROPERTY_NAME_BUILDERS] = {}
        }
        if (!target[PROPERTY_NAME_BUILDERS][id]) {
            target[PROPERTY_NAME_BUILDERS][id] = builder
        }
        return target[PROPERTY_NAME_BUILDERS][id]
    }

    /**
     * Class decorator used to register a CustomElement.
     * @param options the options
     */
    static element<T extends HTMLElement>(options: ElementDecoratorOptions<T> = {}) {
        return function (constructor: CustomElementConstructor<T>) {
            const builder = options.builder ? options.builder : ElementBuilder.get(constructor)
            if (options.name) {
                builder.name(options.name)
            }
            if (options.extends) {
                builder.extends(options.extends)
            }
            return builder.register()
        }
    }

    /**
     * Provide a fresh builder.
     * @param constructor the constructor.
     */
    static get<T extends HTMLElement>(constructor: CustomElementConstructor<T>) {
        const name = toKebabCase(constructor.name || '')
        return new ElementBuilder<T>(name, constructor)
    }

    /**
     * The tag name of the custom element.
     * By default it is the kebab case of the class name.
     * @param tagName the tag name
     */
    name(tagName: string) {
        this.elName = tagName
        return this
    }

    /**
     * The tag name of the extended HTML element.
     * @param tagName the tag name
     */
    extends(tagName: string) {
        this.elExtends = tagName
        return this
    }

    /**
     * A list of builder used to enhance the CustomElement.
     * @param builders a list of builders
     */
    builder(...builders: Array<Builder>) {
        this.builders.push.apply(this.builders, builders)
        return this
    }

    /**
     * Register a hook which will be invoked before the execution of regular hooks.
     *
     * The is API is dedicated for developer of Builders.
     * @protected
     * @param name the name
     * @param callback the callback
     */
    before<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K]) {
        if (!this.hooks[name]) {
            this.hooks[name] = {
                before: [],
                between: [],
                after: []
            }
        }
        this.hooks[name].before.push(callback)
        return this
    }

    /**
     * Register a hook.
     *
     * The is API is dedicated for developer of Builders.
     * @protected
     * @param name the name
     * @param callback the callback
     */
    on<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K]) {
        if (!this.hooks[name]) {
            this.hooks[name] = {
                before: [],
                between: [],
                after: []
            }
        }
        this.hooks[name].between.push(callback)
        return this
    }

    /**
     * Register a hook which will be invoked after the execution of regular hooks.
     *
     * The is API is dedicated for developer of Builders.
     * @protected
     * @param name the name
     * @param callback the callback
     */
    after<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K]) {
        if (!this.hooks[name]) {
            this.hooks[name] = {
                before: [],
                between: [],
                after: []
            }
        }
        this.hooks[name].after.push(callback)
        return this
    }

    /**
     * Invokes the registered hooks.
     *
     * The is API is dedicated for developer of Builders.
     * @protected
     * @param type the type
     * @param name the name
     * @param cb the callback
     */
    invoke(type: 'before' | 'between' | 'after', name: string, cb: (callback: Function) => void) {
        if (this.hooks[name]) {
            this.hooks[name][type].forEach(callback => cb(callback))
        }
    }

    /**
     * Build and register the CustomElement.
     * The output is a "Wrapper" which extends the CustomElement class.
     */
    register(): CustomElementConstructor<T> {

        if (customElements.get(this.elName)) {
            return customElements.get(this.elName)
        }

        const OriginalClass = this.elConstructor
        const altBuilders: Array<Builder> = Object.values(OriginalClass.prototype[PROPERTY_NAME_BUILDERS] || {})
        delete OriginalClass.prototype[PROPERTY_NAME_BUILDERS]
        const builders = [...this.builders, ...altBuilders]
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
                if (super['connectedCallback']) {
                    super['connectedCallback']()
                }
                hooks.invoke('after', 'connectedCallback', callback => callback(this))
            }

            disconnectedCallback() {
                hooks.invoke('before', 'disconnectedCallback', callback => callback(this))
                hooks.invoke('between', 'disconnectedCallback', callback => callback(this))
                if (super['disconnectedCallback']) {
                    super['disconnectedCallback']()
                }
                hooks.invoke('after', 'disconnectedCallback', callback => callback(this))
            }

            adoptedCallback() {
                hooks.invoke('before', 'adoptedCallback', callback => callback(this))
                hooks.invoke('between', 'adoptedCallback', callback => callback(this))
                if (super['adoptedCallback']) {
                    super['adoptedCallback']()
                }
                hooks.invoke('after', 'adoptedCallback', callback => callback(this))
            }

            attributeChangedCallback(name: string, oldValue: null | string, newValue: null | string) {
                hooks.invoke('before', 'attributeChangedCallback', callback => callback(this, name, oldValue, newValue))
                hooks.invoke('between', 'attributeChangedCallback', callback => callback(this, name, oldValue, newValue))
                if (super['attributeChangedCallback']) {
                    super['attributeChangedCallback'](name, oldValue, newValue)
                }
                hooks.invoke('after', 'attributeChangedCallback', callback => callback(this, name, oldValue, newValue))
            }
        }

        builders.forEach(builder => builder.build(Wrapper, this))

        customElements.define(this.elName, Wrapper, {
            extends: this.elExtends
        })

        // @ts-ignore
        return Wrapper
    }

}
