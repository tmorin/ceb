/**
 * The symbol is used to lookup component instances.
 */
export const ComponentSymbol = Symbol.for("ceb/inversion/Component")

/**
 * A component follows the lifecycle of a container.
 * It is a good place to configure event listeners making the glue with other bounded contexts.
 *
 * @example Implement and register component
 * ```typescript
 * import inversion from "@tmorin/ceb-inversion-core"
 * // implement a component
 * class DummyComponent extends inversion.Component {
 *   constructor() {
 *     super()
 *   }
 *   async configure() {
 *     // execute things when container starts
 *   }
 *   async dispose() {
 *     // execute things when container stops
 *   }
 * }
 * // register the component in a module
 * class DummyModule extends inversion.AbstractModule {
 *   constructor() {
 *     super()
 *   }
 *   async configure() {
 *     this.registry.registerValue(inversion.ComponentSymbol, new DummyComponent())
 *   }
 * }
 * ```
 */
export abstract class Component {

    /**
     * The method in invoked during the initialization phase of the {@link Container}.
     */
    async configure(): Promise<void> {
    }

    /**
     * The method in invoked during the dispose phase of the {@link Container}.
     */
    async dispose(): Promise<void> {
    }

}
