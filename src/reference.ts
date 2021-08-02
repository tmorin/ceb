import {Builder, CustomElementConstructor} from "./builder"
import {HooksRegistration} from "./hook"
import {ElementBuilder} from "./element"

/**
 * The builder enhances a readonly property to execute a CSS Selector once the property is get.
 * So that, a property of the Custom Element can always be related to a child element or a set of child elements.
 *
 * By default, the CSS selector targets a child element by its identifier (i.e. the attribute `id`) : `#<PROPERTY NAME>`.
 * The default CSS selector can be overridden with {@link ReferenceBuilder.selector}.
 *
 * By default, the selector targets only one child element, i.e. `querySelector(....)`.
 * However, a selection of many child nodes, can be done with {@link ReferenceBuilder.array}, i.e. `querySelectorAll(....)`.
 *
 * By default, the selection is done into the Light DOM.
 * Nevertheless, the selection can be done into the Shadow DOM with {@link ReferenceBuilder.shadow}.
 *
 * By default the property type should be a specialization of `Element`.
 * When the option {@link ReferenceBuilder.array} is used, the property type must be an Array of `Element` specializations.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link ReferenceBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class ReferenceBuilder<E extends HTMLElement = HTMLElement> implements Builder<E> {

    private constructor(
        private _propName?: string,
        private _selectors?: string,
        private _isArray = false,
        private _isShadow = false
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param propName the property name, it's optional only when the decorator API (i.e. {@link ReferenceBuilder.decorate}) is used
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(propName?: string) {
        return new ReferenceBuilder<E>(propName, propName ? `#${propName}` : undefined)
    }

    /**
     * The CSS selector used to identify the child element(s).
     *
     * @example
     * ```typescript
     * import {ElementBuilder, ReferenceBuilder} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     readonly inputElement: HTMLInputElement
     *     connectedCallback() {
     *         this.innerHTML = `Hello, <input value="World">!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     ReferenceBuilder.get("inputElement").selector('input')
     * ).register()
     * ```
     *
     * @param selector the CSS selector
     */
    selector(selector: string) {
        this._selectors = selector
        return this
    }

    /**
     * Switch to the `Array` type.
     * In this case, the output is an array of matched elements.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, ReferenceBuilder} from "ceb"
     * class CebExample extends HTMLElement {
     *     readonly liElements: Array<HTMLLiElement>
     *     connectedCallback() {
     *         this.innerHTML = `<ul>
     *             <li>Item A</li>
     *             <li>Item B</li>>
     *         </ul>`
     *     }
     * }
     * ElementBuilder.get(CebExample).builder(
     *     ReferenceBuilder.get("inputElement").selector('li').array()
     * ).register()
     * ```
     */
    array() {
        this._isArray = true
        return this
    }

    /**
     * By default, the selection of the target element(s) is done in the light DOM.
     * This option forces the selection into the shadow DOM.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, ReferenceBuilder} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     readonly nameInput: HTMLInputElement
     *     connectedCallback() {
     *         this.attachShadow({mode: "open"})
     *         this.shadowRoot.innerHTML = `Hello, <input id="nameInput" value="World">!`
     *     }
     * }
     * ElementBuilder.get(HelloWorld).builder(
     *     ReferenceBuilder.get("inputElement").shadow()
     * ).register()
     * ```
     */
    shadow() {
        this._isShadow = true
        return this
    }

    /**
     * Property decorator used to define a property reference.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, ReferenceBuilder} from "ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     @ReferenceBuilder.get("inputElement")
     *         .shadow()
     *         .selector('input')
     *         .decorate()
     *     readonly nameInput: HTMLInputElement
     *     connectedCallback() {
     *         this.attachShadow({mode: "open"})
     *         this.shadowRoot.innerHTML = `Hello, <input value="World">!`
     *     }
     * }
     * ```
     */
    decorate(): PropertyDecorator {
        return (target: Object, propName: string | symbol) => {
            if (!this._propName) {
                this._propName = propName.toString()
            }
            if (!this._selectors) {
                this._selectors = `#${this._propName}`
            }
            const id = `field-${this._propName}`
            ElementBuilder.getOrSet(target, id, this)
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E>) {
        if (!this._propName) {
            throw new TypeError("ReferenceBuilder - the property name is missing")
        }
        if (!this._selectors) {
            throw new TypeError("ReferenceBuilder - the CSS selector is missing")
        }

        const _propName = this._propName
        const _selectors = this._selectors
        const _isArray = this._isArray
        const _isShadow = this._isShadow

        hooks.before("constructorCallback", el => {
            Object.defineProperty(el, _propName, {
                get(): any {
                    const base = _isShadow ? el.shadowRoot : el
                    if (base) {
                        return _isArray ? Array.from(base.querySelectorAll(_selectors)) : base.querySelector(_selectors)
                    }
                }
            })
        })
    }
}
