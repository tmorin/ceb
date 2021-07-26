import {Builder, CustomElementConstructor} from "./builder"
import {HooksRegistration} from "./hook"
import {ElementBuilder} from "./element"

/**
 * The options of the decorator {@link ReferenceBuilder.reference}.
 */
export type ReferenceDecoratorOptions ={
    /**
     * The CSS selector used to identify the DOM element(s).
     */
    selector?: string
    /**
     * The property can be an array.
     * In this case, the output is an array of matched elements.
     */
    isArray?: boolean
    /**
     * By default, the builder uses the `querySelector` method of the CustomElement.
     * With this option, the builder will use the `querySelector` method of the attached (and opened) shadow DOM.
     */
    isShadow?: boolean
}

/**
 * The builder provides services to select a DOM node or a set of DOM nodes from a readonly property, i.e. `get prop { ... }`.
 *
 * @example With the builder API - Get a reference of an `input` element
 * ```typescript
 * import {ElementBuilder, ReferenceBuilder} from "ceb"
 * class HelloWorld extends HTMLElement {
 *     readonly inputElement: HTMLInputElement
 *     connectedCallback() {
 *         this.innerHTML = `Hello, <input value="World">!`
 *     }
 * }
 * ElementBuilder.get().builder(
 *     ReferenceBuilder.get("inputElement").selector('input')
 * ).register()
 * ```
 *
 * @example With the decorator API - Get a reference of an `input` element
 * ```typescript
 * import {ElementBuilder, ReferenceBuilder} from "ceb"
 * @ElementBuilder.element()
 * class HelloWorld extends HTMLElement {
 *     @ReferenceBuilder.reference({selector: "input"})
 *     readonly input: HTMLInputElement
 *     connectedCallback() {
 *         this.innerHTML = `Hello, <input value="World">!`
 *     }
 * }
 * ```
 */
export class ReferenceBuilder implements Builder {

    private constructor(
        private propName: string,
        private selectors: string,
        private isArray = false,
        private isShadow = false
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param propName the property name
     */
    static get(propName: string) {
        return new ReferenceBuilder(propName, `#${propName}`)
    }

    /**
     * Property Decorator used to get embedded HTML elements.
     * @param options the options
     */
    static reference(options: ReferenceDecoratorOptions = {}) {
        return function (target: HTMLElement, propName: string) {
            const id = `field-${propName}`
            const builder = ElementBuilder.getOrSet(target, id, ReferenceBuilder.get(propName))
            if (options.selector) {
                builder.selector(options.selector)
            }
            if (options.isArray) {
                builder.array()
            }
            if (options.isShadow) {
                builder.shadow()
            }
        }
    }

    /**
     * The CSS selector used to identify the DOM element(s).
     * @param selector the selector
     */
    selector(selector: string) {
        this.selectors = selector
        return this
    }

    /**
     * The property can be an array.
     * In this case, the output is an array of matched elements.
     */
    array() {
        this.isArray = true
        return this
    }

    /**
     * By default, the builder uses the `querySelector` method of the CustomElement.
     * With this option, the builder will use the `querySelector` method of the attached (and opened) shadow DOM.
     */
    shadow() {
        this.isShadow = true
        return this
    }

    /**
     * The is API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        const selectors = this.selectors
        const isArray = this.isArray
        const isShadow = this.isShadow

        hooks.before("constructorCallback", el => {
            Object.defineProperty(el, this.propName, {
                get(): any {
                    const base = isShadow ? el.shadowRoot : el
                    return isArray ? Array.from(base.querySelectorAll(selectors)) : base.querySelector(selectors)
                }
            })
        })
    }
}
