/**
 * The key of an item in the registry.
 */
export type RegistryKey = string | symbol

/**
 * A registry is used to store things managed by a container.
 */
export interface Registry {

    /**
     * Register a new key/value entry.
     *
     * @example Register a simple greeting text
     * ```typescript
     * import {inversion} from "@tmorin/ceb-bundle-web"
     * const registry = new inversion.registry()
     * registry.registerValue("greeting", "Hello, World!")
     * ```
     *
     * @param key the key
     * @param value the value
     * @return the registry
     */
    registerValue(key: RegistryKey, value: any): this

    /**
     * Register a factory.
     *
     * @example Use a factory to register a simple greeting text
     * ```typescript
     * import {inversion} from "@tmorin/ceb-bundle-web"
     * const registry = new inversion.registry()
     * registry.registerFactory("greeting", () => "Hello, World!")
     * ```
     *
     * @param key the key
     * @param factory the value
     * @param options the options
     * @return the registry
     */
    registerFactory<T>(key: RegistryKey, factory: ValueFactory<T>, options?: FactoryOptions): this

    /**
     * Resolve the first found entry matching a key.
     *
     * @example Resolve a simple greeting text
     * ```typescript
     * import {inversion} from "@tmorin/ceb-bundle-web"
     * const registry = new inversion.registry()
     * registry.registerValue("greeting", "Hello, World!")
     * console.info(registry.resolve("greeting"))
     * ```
     *
     * @param key the key
     * @return the value
     */
    resolve<T>(key: RegistryKey): T

    /**
     * Resolve all entries matching a key.
     *
     * @example Resolve many greeting texts
     * ```typescript
     * import {inversion} from "@tmorin/ceb-bundle-web"
     * const registry = new inversion.registry()
     * registry.registerValue("greeting", "Hello, World!")
     * registry.registerValue("greeting", "Hello, John Doe!")
     * console.info(registry.resolveAll("greeting"))
     * ```
     *
     * @param key the key
     * @return the values
     */
    resolveAll<T>(key: RegistryKey): Array<T>

    /**
     * Checks if the key match an entry.
     *
     * @example Check if an entry exist
     * ```typescript
     * import {inversion} from "@tmorin/ceb-bundle-web"
     * const registry = new inversion.registry()
     * registry.registerValue("greeting", "Hello, World!")
     * console.info(registry.contains("greeting"))
     * ```
     *
     * @param key the key
     * @return true when the key matches an existing entry.
     */
    contains(key: RegistryKey): boolean
}

/**
 * The factory of a registry entry value.
 */
export interface ValueFactory<T> {
    /**
     * @param registry a registry
     * @return the value
     */
    (registry: Registry): T
}

/**
 * An entry in the registry.
 */
interface Entry<T> {
    /**
     * Return the value of the entry.
     * @param registry a registry
     * @return the value
     */
    get(registry: Registry): T
}

/**
 * An entry of type value.
 */
class ValueEntry<T> implements Entry<T> {
    constructor(
        readonly value: T
    ) {
    }

    get(registry: Registry): T {
        return this.value
    }
}

/**
 * The factory options.
 */
export type FactoryOptions = {
    /**
     * When `true`, then the factory will only be called once.
     */
    singleton?: boolean
}

/**
 * An entry of type factory.
 */
class FactoryEntry<T> implements Entry<T> {
    constructor(
        private readonly factory: ValueFactory<T>,
        private readonly options: FactoryOptions = {},
        private value?: T
    ) {
    }

    get(registry: Registry): T {
        if (this.options.singleton) {
            if (typeof this.value === "undefined") {
                this.value = this.factory(registry)
            }
            return this.value
        }
        return this.factory(registry)
    }
}

/**
 * The default implementation of a registry.
 */
export class DefaultRegistry implements Registry {

    constructor(
        /**
         * A default set of entries.
         * @private
         */
        private readonly entries = new Map<RegistryKey, Array<Entry<any>>>()
    ) {
    }

    registerValue(key: RegistryKey, value: any): this {
        if (!this.entries.has(key)) {
            this.entries.set(key, [])
        }
        this.entries.get(key)?.unshift(new ValueEntry(value))
        return this
    }

    registerFactory<T>(key: RegistryKey, factory: ValueFactory<T>, options: FactoryOptions = {}): this {
        if (!this.entries.has(key)) {
            this.entries.set(key, [])
        }
        this.entries.get(key)?.unshift(new FactoryEntry(factory, options))
        return this
    }

    resolve<T>(key: RegistryKey): T {
        if (this.entries.has(key)) {
            const entries = this.entries.get(key)
            if (entries && entries[0]) {
                return entries[0].get(this)
            }
            throw new Error(`the key (${String(key)}) has no entries`)
        }
        throw new Error(`unable to resolve an entry with the key (${String(key)})`)
    }

    resolveAll<T>(key: RegistryKey): Array<T> {
        if (this.entries.has(key)) {
            const entries = this.entries.get(key)
            return [...(entries || []).map(entry => entry.get(this))]
        }
        throw new Error(`unable to resolve an entry with the key (${String(key)})`)
    }

    contains(key: RegistryKey): boolean {
        return this.entries.has(key)
    }

}
