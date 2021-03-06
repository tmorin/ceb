export type HookCallbacks = {
    'constructorCallback': (el: HTMLElement) => void
    'connectedCallback': (el: HTMLElement) => void
    'disconnectedCallback': (el: HTMLElement) => void
    'adoptedCallback': (el: HTMLElement) => void
    'attributeChangedCallback': (el: HTMLElement, attName: string, oldVal: string | null, newVal: string | null) => void
}

export interface HooksRegistration {
    /**
     * Register a hook which will be invoked before the execution of regular hooks.
     * @param name the name
     * @param callback the callback
     */
    before<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K])

    /**
     * Register a hook.
     * @param name the name
     * @param callback the callback
     */
    on<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K])

    /**
     * Register a hook which will be invoked after the execution of regular hooks.
     * @param name the name
     * @param callback the callback
     */
    after<K extends keyof HookCallbacks>(name: K, callback: HookCallbacks[K])
}
