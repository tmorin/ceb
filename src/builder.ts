import {HooksRegistration} from './hook'

export interface CustomElementConstructor<T extends HTMLElement> {
    new(...args: any[]): T
}

/**
 * A builder.
 */
export interface Builder {
    /**
     * The logic of the builder.
     * @param Constructor the constructor of the custom element
     * @param hooks an helper to register hooks
     */
    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration)
}
