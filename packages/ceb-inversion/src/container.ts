import {Module, ModuleConfiguration} from './module';
import {DefaultRegistry, Registry} from './registry';
import {Component, ComponentSymbol} from './component';

function toBase64(value: string) {
    return typeof btoa === "function" ? btoa(value) : Buffer.from(value).toString("base64")
}

/**
 * The configuration of a container.
 */
export interface ContainerConfiguration extends ModuleConfiguration {
    /**
     * The name of the container.
     */
    name: string,
    /**
     * The modules of the container.
     */
    modules: Array<Module>
}

/**
 * The symbol can be used to lookup container instances.
 */
export const ContainerSymbol = Symbol.for('ceb/inversion/Container');

/**
 * A container implements the Dependency Injection pattern.
 *
 * Containers are exclusively created with {@link ContainerBuilder}.
 *
 * By default, the container it-self is available from the registry with the key ${@link ContainerSymbol}.
 *
 * @example Create and initialize a container
 * ```typescript
 * import {inversion} from "@tmorin/ceb"
 * inversion.ContainerBuilder.get()
 *   .build()
 *   .initialize()
 *   .then(initializedContainer => {
 *     const resolvedContainer = initializedContainer.registry
 *       .resolve(inversion.ContainerSymbol)
 *     console.assert(initializedContainer === resolvedContainer)
 *   })
 *   .catch(error => console.error(
 *     "unable to initialize the container",
 *     error
 *   ))
 * ```
 */
export class Container {

    /**
     * The registry contains all managed objects.
     */
    public readonly registry: Registry;
    private readonly configuration: ContainerConfiguration;
    private readonly modules: Array<Module>;

    /**
     * @protected
     */
    constructor(
        configuration: Partial<ContainerConfiguration> = {}
    ) {
        const name = configuration.name || `container-${toBase64(String(Date.now()))}`;
        const registry: Registry = configuration.registry || new DefaultRegistry();
        const modules: Array<Module> = configuration.modules || [];
        this.configuration = {...configuration, name, registry, modules};
        this.registry = this.configuration.registry;
        this.modules = this.configuration.modules;
    }

    /**
     * The name of the container.
     */
    get name() {
        return this.configuration.name
    }

    /**
     * Initialize the container.
     *
     * 1. initialize the modules
     * 2. discover and configure the components
     *
     *  @return the container it-self
     */
    async initialize(): Promise<this> {
        this.registry.registerValue(ContainerSymbol, this);

        for (const module of this.modules) {
            await module.initialize(this.configuration);
        }

        if (this.registry.contains(ComponentSymbol)) {
            const components = this.registry.resolveAll<Component>(ComponentSymbol);
            for (const component of components) {
                await component.configure();
            }
        }

        return this;
    }

    /**
     * Clean a container instance.
     *
     * 1. dispose the components
     * 2. dispose the modules
     *
     * @return the container it-self
     */
    async dispose() {
        if (this.registry.contains(ComponentSymbol)) {
            const components = this.registry.resolveAll<Component>(ComponentSymbol);
            const reversedComponents = [...components].reverse();
            for (const component of reversedComponents) {
                await component.dispose();
            }
        }

        const reversedNodules = [...this.modules].reverse();
        for (const module of reversedNodules) {
            await module.dispose();
        }
    }

}

/**
 * Builds a {@link Container} instance.
 */
export class ContainerBuilder {

    private constructor(
        private readonly _modules: Array<Module> = [],
        private _name?: string,
        private _registry: Registry = new DefaultRegistry()
    ) {
    }

    /**
     * Get a fresh builder.
     */
    static get() {
        return new ContainerBuilder();
    }

    /**
     * Set a custom container name.
     * @param name the name
     * @return the builder
     */
    name(name: string) {
        this._name = name;
        return this;
    }

    /**
     * Set a custom registry.
     * @param registry the registry
     * @return the builder
     */
    registry(registry: Registry) {
        this._registry = registry;
        return this;
    }

    /**
     * Register modules.
     * @param modules the modules
     * @return the builder
     */
    module(...modules: Array<Module>) {
        for (const module of modules) {
            this._modules.push(module);
        }
        return this;
    }

    /**
     * Register an array of modules.
     * @param modules the modules
     * @return the builder
     */
    modules(modules: Array<Module>) {
        for (const module of modules) {
            this._modules.push(module);
        }
        return this;
    }

    /**
     * Build the container.
     * @return the container
     */
    build(): Container {
        return new Container({
            name: this._name,
            registry: this._registry,
            modules: this._modules
        })
    }

}
