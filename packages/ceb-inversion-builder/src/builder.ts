import {Builder, CustomElementConstructor, ElementBuilder, HooksRegistration} from "@tmorin/ceb-elements-core"
import {Container, RegistryKey} from "@tmorin/ceb-inversion-core"

/**
 * Factory of a container.
 */
export interface ContainerProvider {
  /**
   * @return the container
   */
  (): Container
}

/**
 * The builder injects an entry from a container into a Custom Element.
 *
 * @example Inject an entry resolving its key from the property name
 * ```typescript
 * import {ElementBuilder} from "@tmorin/ceb-elements-core"
 * import {ContainerBuilder, OnlyConfigureModule} from "@tmorin/ceb-inversion-core"
 * import {InversionBuilder, InversionBuilderModule} from "@tmorin/ceb-inversion-builder"
 *
 * // define the Custom Element
 * @ElementBuilder.get(TestElement).decorate()
 * class TestElement extends HTMLElement {
 *   // inject the value of the registry matching the key "greeting"
 *   @InversionBuilder.get().decorate()
 *   greeting?: string
 *
 *   attachedCallback() {
 *     this.textContent = this.greeting
 *   }
 * }
 *
 * // build the container
 * ContainerBuilder.get()
 *   .module(new InversionBuilderModule())
 *   .module(OnlyConfigureModule.create(async function () {
 *     // register the "greeting" value
 *     this.registry.registerFactory<string>("greeting", () => "Hello, World!")
 *   })
 *   .initialize()
 *   .then(_ => document.body.appendChild(new TestElement()))
 * ```
 */
export class InversionBuilder<E extends HTMLElement> implements Builder<E> {
  private static DEFAULT_CONTAINER: Container

  protected constructor(
    private _propName?: string,
    private _key?: RegistryKey,
    private _provider?: ContainerProvider
  ) {}

  /**
   * Set the default {@link Container}.
   * @param container the container
   * @internal
   */
  static setDefaultContainer(container: Container) {
    InversionBuilder.DEFAULT_CONTAINER = container
  }

  /**
   * Provides a fresh builder.
   * @param propName the property name
   * @template E the type of the Custom Element
   */
  static get<E extends HTMLElement>(propName?: string) {
    return new InversionBuilder<E>(propName)
  }

  /**
   * Set the registry key.
   * @param key the registry key
   */
  key(key: RegistryKey): InversionBuilder<E> {
    this._key = key
    return this
  }

  /**
   * Set the Container provider.
   * @param provider the provider
   */
  provider(provider: ContainerProvider): InversionBuilder<E> {
    this._provider = provider
    return this
  }

  /**
   * Decorates the property of the bus.
   */
  decorate(): PropertyDecorator {
    return (target, propName) => {
      this._propName = propName.toString()
      if (!this._key) {
        this._key = this._propName
      }
      const id = `field-inversion-${this._propName}`
      ElementBuilder.getOrSet(target, this, id)
    }
  }

  build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E>): void {
    if (!this._propName) {
      throw new TypeError("InversionBuilder - the property name is missing")
    }
    if (!this._key) {
      throw new TypeError("InversionBuilder - the registry key is missing")
    }
    const _propName = this._propName
    const _key = this._key
    const _provider = this._provider
    hooks.before("constructorCallback", (el) => {
      let _container: Container
      if (_provider) {
        _container = _provider()
      } else if (InversionBuilder.DEFAULT_CONTAINER) {
        _container = InversionBuilder.DEFAULT_CONTAINER
      } else {
        throw new TypeError("InversionBuilder - unable to resolve a Container")
      }
      Object.defineProperty(el, _propName, {
        value: _container.registry.resolve(_key),
        configurable: false,
        writable: false,
        enumerable: true,
      })
    })
  }
}
