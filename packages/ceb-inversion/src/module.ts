import {Registry} from './registry';

/**
 * The available configuration of a module.
 */
export interface ModuleConfiguration {
    /**
     * The registry.
     */
    registry: Registry
}

/**
 * From a DDD point of view, a module is either a module or a bounded contexts.
 * A module follows the lifecycle of the container.
 *
 * The abstract class {@link AbstractModule} is a good starting point to implement a module.
 * The implementation of an inline module can be quickly done with {@link OnlyConfigureModule}.
 */
export interface Module {

    /**
     * Initialize the module.
     * @param configuration the configuration
     */
    initialize(configuration: ModuleConfiguration): Promise<void>

    /**
     * Dispose the module.
     */
    dispose(): Promise<void>

}

/**
 * A configurable module is module not yet configured by a container.
 * Therefore, its configuration can still be adapted.
 */
export interface ConfigurableModule {
    /**
     * The registry.
     */
    registry: Registry

    /**
     * Provide the configuration of the module.
     */
    configure(this: ConfigurableModule): Promise<void>
}

/**
 * This abstract implementation is used to helps the implementation of modules.
 *
 * @example Implement and register a module
 * ```typescript
 * import {inversion} from "@tmorin/ceb"
 * // implement a module
 * class GreetingModule extends inversion.AbstractModule {
 *   constructor() {
 *     super()
 *   }
 *   async configure() {
 *     this.registry.registerValue("greeting", "hello, World!")
 *   }
 * }
 * // register the module
 * const container = inversion.ContainerBuilder.get()
 *   .module(new GreetingModule())
 *   .build()
 * ```
 */
export abstract class AbstractModule implements Module, ConfigurableModule {

    private configuration?: ModuleConfiguration

    get registry(): Registry {
        if (!this.configuration) {
            throw new Error("the module is not initialized because its configuration property is falsy")
        }
        return this.configuration.registry;
    }

    /**
     * @protected
     */
    async initialize(configuration: ModuleConfiguration): Promise<void> {
        this.configuration = configuration;
        await this.configure();
    }

    /**
     * Implement this method to register things in the container registry.
     */
    abstract configure(this: ConfigurableModule): Promise<void>

    /**
     * Override this method to cleanup things when the container is disposed.
     */
    async dispose(): Promise<void> {
    }

}

/**
 * An helper class to define module using an "inline" approach.
 *
 * @example register an inline module
 * ```typescript
 * import {inversion} from "@tmorin/ceb"
 * const container = inversion.ContainerBuilder.get()
 *   .module(inversion.OnlyConfigureModule.create(() => {
 *       this.registry.registerValue("greeting", "hello, World!")
 *   }))
 *   .build()
 * ```
 */
export class OnlyConfigureModule extends AbstractModule {
    private constructor(private readonly _configure: (this: ConfigurableModule) => Promise<void>) {
        super();
    }

    /**
     * Create a fresh module from a lambda.
     *
     * The context (i.e. `this`) is an instance of {@link ConfigurableModule}.
     * Therefore, `this.registry` is available.
     *
     * @param cb the lambda to configure the module
     * @return the fresh module
     */
    static create(cb: (this: ConfigurableModule) => Promise<void>) {
        return new OnlyConfigureModule(cb);
    }

    /**
     * @protected
     */
    async configure(): Promise<void> {
        await this._configure.apply(this)
    }

    /**
     * @protected
     */
    async dispose(): Promise<void> {
        return super.dispose()
    }
}
