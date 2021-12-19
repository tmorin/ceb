import { Container, RegistryKey } from "@tmorin/ceb-inversion-core"
import { Gateway, GatewaySymbol } from "@tmorin/ceb-messaging-core"
import { AbstractGatewayBuilder } from "@tmorin/ceb-messaging-builder-core"

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
 * The builder injects a {@link Gateway} in Custom Elements.
 *
 * @template E the type of the Custom Element
 */
export class GatewayInversionBuilder<E extends HTMLElement> extends AbstractGatewayBuilder<E> {
  private static DEFAULT_CONTAINER: Container

  /**
   * @internal
   */
  protected constructor(
    _propName = "gateway",
    private _key: RegistryKey = GatewaySymbol,
    private _provider?: ContainerProvider
  ) {
    super(() => {
      let _container: Container
      if (_provider) {
        _container = _provider()
      } else if (GatewayInversionBuilder.DEFAULT_CONTAINER) {
        _container = GatewayInversionBuilder.DEFAULT_CONTAINER
      } else {
        throw new TypeError("GatewayInversionBuilder - unable to resolve a Container")
      }
      return _container.registry.resolve<Gateway>(_key)
    }, _propName)
  }

  /**
   * Set the default {@link Container}.
   * @param container the container
   * @internal
   */
  static setDefaultContainer(container: Container) {
    GatewayInversionBuilder.DEFAULT_CONTAINER = container
  }

  /**
   * Provides a fresh builder.
   * @param propName the property name
   * @template E the type of the Custom Element
   */
  static get<E extends HTMLElement>(propName?: string) {
    return new GatewayInversionBuilder<E>(propName)
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
