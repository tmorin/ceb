/**
 * The callbacks executed by the hooks.
 *
 * This API is dedicated for developer of Builders.
 * @protected
 */
export type HookCallbacks<T extends HTMLElement = HTMLElement> = {
    'constructorCallback': (el: T) => void
    'connectedCallback': (el: T) => void
    'disconnectedCallback': (el: T) => void
    'adoptedCallback': (el: T) => void
    'attributeChangedCallback': (el: T, attName: string, oldVal: string | null, newVal: string | null) => void
}

/**
 * A HooksRegistration provides a way to execute logic according to the Custom Element life cycle.
 * @template the type of the Custom Element
 *
 * This API is dedicated for developer of Builders.
 * @protected
 */
export interface HooksRegistration<T extends HTMLElement = HTMLElement> {
    /**
     * Register a hook which will be invoked before the execution of regular hooks.
     * @param name the name
     * @param callback the callback
     */
    before<K extends keyof HookCallbacks<T>>(name: K, callback: HookCallbacks<T>[K])

    /**
     * Register a hook.
     * @param name the name
     * @param callback the callback
     */
    on<K extends keyof HookCallbacks<T>>(name: K, callback: HookCallbacks<T>[K])

    /**
     * Register a hook which will be invoked after the execution of regular hooks.
     * @param name the name
     * @param callback the callback
     */
    after<K extends keyof HookCallbacks<T>>(name: K, callback: HookCallbacks<T>[K])
}
