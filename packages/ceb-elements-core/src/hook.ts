/**
 * The callbacks executed by the hooks.
 * @template E the type of the Custom Element
 *
 * This API is dedicated for developer of Builders.
 * @protected
 */
export type HookCallbacks<E extends HTMLElement = HTMLElement> = {
  constructorCallback: (el: E) => void
  connectedCallback: (el: E) => void
  disconnectedCallback: (el: E) => void
  adoptedCallback: (el: E) => void
  attributeChangedCallback: (el: E, attName: string, oldVal: string | null, newVal: string | null) => void
}

/**
 * A HooksRegistration provides a way to execute logic according to the Custom Element life cycle.
 * @template E the type of the Custom Element
 *
 * This API is dedicated for developer of Builders.
 * @protected
 */
export interface HooksRegistration<E extends HTMLElement = HTMLElement> {
  /**
   * Register a hook which will be invoked before the execution of regular hooks.
   * @param name the name
   * @param callback the callback
   */
  before<K extends keyof HookCallbacks<E>>(name: K, callback: HookCallbacks<E>[K]): void

  /**
   * Register a hook.
   * @param name the name
   * @param callback the callback
   */
  on<K extends keyof HookCallbacks<E>>(name: K, callback: HookCallbacks<E>[K]): void

  /**
   * Register a hook which will be invoked after the execution of regular hooks.
   * @param name the name
   * @param callback the callback
   */
  after<K extends keyof HookCallbacks<E>>(name: K, callback: HookCallbacks<E>[K]): void
}
