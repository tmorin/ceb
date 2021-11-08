import {CustomElementConstructor, ElementBuilder, HooksRegistration} from "@tmorin/ceb-core";
import {Container, RegistryKey} from "@tmorin/ceb-inversion";
import {Bus, BusSymbol} from "@tmorin/ceb-messaging-core";
import {AbstractBusBuilder} from "@tmorin/ceb-messaging-core-builder";

/**
 * Provider of the container.
 */
export interface ContainerProvider {
    /**
     * @return the container
     */
    (): Container
}

/**
 * The builder injects a {@link Bus} in Custom Elements.
 *
 * @template E the type of the Custom Element
 */
export class BusInversionBuilder<E extends HTMLElement> extends AbstractBusBuilder<E> {

    private static DEFAULT_CONTAINER: Container

    protected constructor(
        _propName: string = "bus",
        private _key: RegistryKey = BusSymbol,
        private _provider?: ContainerProvider,
    ) {
        super(
            () => {
                let _container: Container
                if (_provider) {
                    _container = _provider()
                } else if (BusInversionBuilder.DEFAULT_CONTAINER) {
                    _container = BusInversionBuilder.DEFAULT_CONTAINER
                } else {
                    throw new TypeError("BusInversionBuilder - unable to resolve a Container")
                }
                return _container.registry.resolve<Bus>(_key)
            },
            _propName
        )
    }

    /**
     * Set the default {@link Container}.
     * @param container the container
     * @internal
     */
    static setDefaultContainer(container: Container) {
        BusInversionBuilder.DEFAULT_CONTAINER = container
    }

    /**
     * Provides a fresh builder.
     * @param propName the property name
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(propName?: string) {
        return new BusInversionBuilder<E>(propName)
    }

    /**
     * Set the registry key.
     * @param key the registry key
     */
    key(key: RegistryKey): this {
        this._key = key
        return this
    }

    /**
     * Set the Container provider.
     * @param provider the provider
     */
    provider(provider: ContainerProvider): this {
        this._provider = provider
        return this
    }

}
