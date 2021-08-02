import {HooksRegistration} from './hook'

/**
 * The constructor of a Custom Element
 * @template E the type of the Custom Element
 *
 * This API is dedicated for developer of Builders.
 * @protected
 */
export interface CustomElementConstructor<E extends HTMLElement = HTMLElement> {
    new(...args: any[]): E
}

/**
 * A builder.
 * @template E the type of the Custom Element
 */
export interface Builder<E extends HTMLElement = HTMLElement> {
    /**
     * The logic of the builder.
     * @param Constructor the constructor of the custom element
     * @param hooks an helper to register hooks
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E>) : void
}
