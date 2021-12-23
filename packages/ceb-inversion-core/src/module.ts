import { Registry } from "./registry"

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
 * import {ContainerBuilder, AbstractModule} from "@tmorin/ceb-inversion-core"
 * // implement a module
 * class GreetingModule extends AbstractModule {
 *   constructor() {
 *     super()
 *   }
 *   async configure() {
 *     this.registry.registerValue("greeting", "hello, World!")
 *   }
 * }
 * // register the module
 * const container = ContainerBuilder.get()
 *   .module(new GreetingModule())
 *   .build()
 * ```
 */
export abstract class AbstractModule implements Module, ConfigurableModule {
  private configuration?: ModuleConfiguration

  /**
   * The registry.
   */
  get registry(): Registry {
    if (!this.configuration) {
      throw new Error("the module is not initialized because its configuration property is falsy")
    }
    return this.configuration.registry
  }

  /**
   * @protected
   */
  async initialize(configuration: ModuleConfiguration): Promise<void> {
    this.configuration = configuration
    await this.configure()
  }

  /**
   * Implement this method to register things in the container registry.
   */
  abstract configure(this: ConfigurableModule): Promise<void>

  /**
   * Override this method to cleanup things when the container is disposed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async dispose(): Promise<void> {}
}

class InlineModule extends AbstractModule {
  private readonly _configure: (this: ConfigurableModule, registry: Registry) => any
  private readonly _dispose: (this: ConfigurableModule, registry: Registry) => any

  public constructor(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    configureCb: (...args: Array<any>) => any = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disposeCb: (...args: Array<any>) => any = () => {}
  ) {
    super()
    this._configure = configureCb.bind(this)
    this._dispose = disposeCb.bind(this)
  }

  async configure(): Promise<void> {
    await Promise.resolve((async () => this._configure(this.registry))())
  }

  async dispose(): Promise<void> {
    await Promise.resolve((async () => this._dispose(this.registry))())
  }
}

/**
 * An helper class to define module using an "inline" approach.
 *
 * @example register an inline module
 * ```typescript
 * import {ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion-core"
 * const container = ContainerBuilder.get()
 *   .module(OnlyConfigureModule.create((registry) => {
 *       registry.registerValue("greeting", "hello, World!")
 *   }))
 *   .build()
 * ```
 * @deprecated replaced by {@link ModuleBuilder}
 */
export class OnlyConfigureModule extends InlineModule {
  private constructor(cb: (...args: Array<any>) => any) {
    super(cb)
  }

  /**
   * Create a fresh module from a callback where the registry is available within the context.
   *
   * The context (i.e. `this`) is an instance of {@link ConfigurableModule}.
   * Therefore, the {@link Registry} is available with`this.registry`.
   *
   * @param cb the callback to configure the module
   * @return the fresh module
   */
  static create(cb: (this: ConfigurableModule) => any): OnlyConfigureModule {
    return new OnlyConfigureModule(cb)
  }
}

/**
 * Create a module on the fly.
 *
 * @example register an inline module
 * ```typescript
 * import {ContainerBuilder, ModuleBuilder} from "@tmorin/ceb-inversion-core"
 * const container = ContainerBuilder.get()
 *   .module(ModuleBuilder.configure((registry) => {
 *       registry.registerValue("greeting", "hello, World!")
 *   }).build())
 *   .build()
 * ```
 */
export class ModuleBuilder {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _configure: (this: ConfigurableModule, registry: Registry) => any = () => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _dispose: (this: ConfigurableModule, registry: Registry) => any = () => {}

  static get(): ModuleBuilder {
    return new ModuleBuilder()
  }

  /**
   * Provide the `configure` callback.
   * @param cb the callback
   */
  configure(cb: (registry: Registry) => any): this {
    this._configure = cb
    return this
  }

  /**
   * Provide the `dispose` callback.
   * @param cb the callback
   */
  dispose(cb: (registry: Registry) => any): this {
    this._dispose = cb
    return this
  }

  /**
   * Build the module.
   */
  build(): Module {
    return new InlineModule(this._configure, this._dispose)
  }
}
