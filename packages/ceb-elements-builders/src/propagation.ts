import { Builder, CustomElementConstructor, ElementBuilder, HooksRegistration } from "@tmorin/ceb-elements-core"
import { AttributeBuilder } from "./attribute"

/**
 * The builder handles the propagation of an attribute's values to embedded elements.
 * That means, each time the attribute is mutated, the mutation is propagated to selected child nodes.
 *
 * The attribute can be provided using its name or with an existing {@link AttributeBuilder} instance.
 *
 * The CSS selector which targets the embedded elements is handled with {@link AttributePropagationBuilder.to}.
 *
 * By default, the propagation selects elements in the Light DOM.
 * Nevertheless, the selection can be done into the Shadow DOM with {@link AttributePropagationBuilder.shadow}.
 *
 * By default, the propagation mutates the targets' attribute which matches the same name.
 * However, the targeted attribute name can be changed with {@link AttributePropagationBuilder.attribute}.
 * Moreover, instead of mutating an attribute, the propagation can mutate a property using {@link AttributePropagationBuilder.property}.
 *
 * Both {@link AttributePropagationBuilder.attribute} and {@link AttributePropagationBuilder.property} are exclusive.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link AttributePropagationBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class AttributePropagationBuilder<E extends HTMLElement = HTMLElement> implements Builder<E> {
  private constructor(
    private readonly _attrBuilder: AttributeBuilder<E>,
    private readonly _fromAttrName = _attrBuilder["_attrName"],
    private _toAttrName = _attrBuilder["_attrName"],
    private _toPropName?: string,
    private _selector?: string,
    private _isShadow = false
  ) {}

  /**
   * Provide a fresh builder.
   * @param attrNameOrBuilder the attribute name or builder
   * @template E the type of the Custom Element
   */
  static get<E extends HTMLElement>(attrNameOrBuilder: string | AttributeBuilder<E>) {
    return new AttributePropagationBuilder<E>(
      typeof attrNameOrBuilder === "string" ? AttributeBuilder.get(attrNameOrBuilder) : attrNameOrBuilder
    )
  }

  /**
   * The CSS selector used to select the DOM elements.
   *
   * @example
   * ```typescript
   * import {ElementBuilder} from "@tmorin/ceb-elements-core"
   * import {AttributePropagationBuilder} from "@tmorin/ceb-elements-builders"
   * class HelloWorld extends HTMLElement {
   *     connectedCallback() {
   *         this.innerHTML = `Hello, <input readonly>!`
   *     }
   * }
   * ElementBuilder.get(HelloWorld).builder(
   *     AttributePropagationBuilder.get("value").to("input")
   * ).register()
   * ```
   *
   * @param selector the CSS selector
   */
  to(selector: string) {
    this._selector = selector
    return this
  }

  /**
   * Change the targeted attribute name.
   *
   * @example
   * ```typescript
   * import {ElementBuilder} from "@tmorin/ceb-elements-core"
   * import {AttributePropagationBuilder, AttributeBuilder} from "@tmorin/ceb-elements-builders"
   * class HelloWorld extends HTMLElement {
   *     connectedCallback() {
   *         this.innerHTML = `Hello, <input value="World">!`
   *     }
   * }
   * ElementBuilder.get(HelloWorld).builder(
   *     AttributePropagationBuilder
   *         .get(AttributeBuilder.get("frozen").boolean())
   *         .to("input")
   *         .attribute("disabled")
   * ).register()
   * ```
   *
   * @param toAttrName the attribute name.
   */
  attribute(toAttrName: string) {
    this._toAttrName = toAttrName
    this._toPropName = undefined
    return this
  }

  /**
   * Propagate to a property.
   *
   * @example
   * ```typescript
   * import {ElementBuilder} from "@tmorin/ceb-elements-core"
   * import {AttributePropagationBuilder, AttributeBuilder} from "@tmorin/ceb-elements-builders"
   * class HelloWorld extends HTMLElement {
   *     connectedCallback() {
   *         this.innerHTML = `Hello, <span></span>!`
   *     }
   * }
   * ElementBuilder.get(HelloWorld).builder(
   *     AttributePropagationBuilder
   *         .get(AttributeBuilder.get("name").default("World"))
   *         .to("span")
   *         .property("textContent")
   * ).register()
   * ```
   *
   * @param toPropName the property name.
   */
  property(toPropName: string) {
    this._toAttrName = undefined
    this._toPropName = toPropName
    return this
  }

  /**
   * By default, the selection of the target elements is done in the light DOM.
   * This option forces the selection into the shadow DOM.
   *
   * @example
   * ```typescript
   * import {ElementBuilder} from "@tmorin/ceb-elements-core"
   * import {AttributePropagationBuilder} from "@tmorin/ceb-elements-builders"
   * class HelloWorld extends HTMLElement {
   *     connectedCallback() {
   *         this.attachShadow({mode: "open"})
   *         this.shadowRoot.innerHTML = `Hello, <input readonly>!`
   *     }
   * }
   * ElementBuilder.get(HelloWorld).builder(
   *     AttributePropagationBuilder.get("value")
   *         .to("input")
   *         .shadow()
   * ).register()
   * ```
   */
  shadow() {
    this._isShadow = true
    return this
  }

  /**
   * Class decorator used to define an attribute propagation.
   *
   * @example
   * ```typescript
   * import {ElementBuilder} from "@tmorin/ceb-elements-core"
   * import {AttributePropagationBuilder, AttributeBuilder} from "@tmorin/ceb-elements-builders"
   * @ElementBuilder.get<HelloWorld>().decorate()
   * @AttributePropagationBuilder.get(
   *     AttributeBuilder.get("name").default("World")
   * ).to("span").property("textContent").decorate()
   * class HelloWorld extends HTMLElement {
   *     connectedCallback() {
   *         this.innerHTML = `Hello, <span></span>!`
   *     }
   * }
   * ```
   */
  decorate<T extends HTMLElement>(): ClassDecorator {
    return (constructor) => {
      const attrId = `attribute-${this._fromAttrName}`
      ElementBuilder.getOrSet(constructor.prototype, this._attrBuilder, attrId)
      const deleId = `delegate-${attrId}`
      ElementBuilder.getOrSet(constructor.prototype, this, deleId)
    }
  }

  /**
   * This API is dedicated for developer of Builders.
   * @protected
   */
  build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E>) {
    if (!this._attrBuilder) {
      throw new TypeError("AttributePropagationBuilder - the attribute builder is missing")
    }
    this._attrBuilder
      .listener((el, data) => {
        this.propagateValue(el, data.newVal)
      })
      .build(Constructor, hooks)
  }

  private propagateValue(el: E, newVal: any) {
    const base = this._isShadow ? el.shadowRoot : el
    if (!base) {
      return
    }
    const targets = this._selector ? base.querySelectorAll(this._selector) : []
    if (targets.length > 0) {
      const _toAttrName = this._toAttrName
      const _toPropName = this._toPropName
      if (_toAttrName) {
        if (typeof newVal === "string") {
          targets.forEach((t) => t.setAttribute(_toAttrName, newVal))
        } else if (newVal === true) {
          targets.forEach((t) => t.setAttribute(_toAttrName, ""))
        } else {
          targets.forEach((t) => t.removeAttribute(_toAttrName))
        }
      } else if (_toPropName) {
        // @ts-ignore
        targets.forEach((t) => (t[_toPropName] = newVal))
      }
    }
  }
}
