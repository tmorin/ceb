import {toKebabCase} from './utilities'
import {Builder, CustomElementConstructor} from './builder'
import {HookCallbacks, HooksRegistration} from './hook'

export interface HookRegistry {
    [key: string]: {
        before: Array<Function>
        between: Array<Function>
        after: Array<Function>
    }
}

/**
 * The options of the decorator:`ElementBuilder.element()`.
 */
export interface ElementDecoratorOptions<T extends HTMLElement> {
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

/**
 * The element builder provides services to define and register CustomElement.
 */
export class ElementBuilder<T extends HTMLElement> implements HooksRegistration {

    constructor(
        private elName: string,
        private elConstructor: CustomElementConstructor<T>,
        private elExtends?: string,
        private builders: Array<Builder> = [],
        private hooks: HookRegistry = {}
    ) {
    }

    /**
     * Get or set builder to a target.
     * @param target the target
     * @param id the id used to identify the builder
     * @param builder the builder
     */
    static getOrSet<B extends Builder>(target: HTMLElement, id: string, builder: B): B {
        if (!target['_cebBuilders']) {
            target['_cebBuilders'] = {}
        }
        if (!target['_cebBuilders'][id]) {
            target['_cebBuilders'][id] = builder
        }
        return target['_cebBuilders'][id]
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
        const altBuilders: Array<Builder> = Object.values(OriginalClass.prototype['_cebBuilders'] || {})
        delete OriginalClass.prototype['_cebBuilders']
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
