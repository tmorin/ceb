import {Builder, CustomElementConstructor} from './builder'
import {HooksRegistration} from './hook'
import {ElementBuilder} from './element'

/**
 * The options of the decorator: `ReferenceBuilder.reference()`.
 */
export interface ReferenceDecoratorOptions {
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
 * Reference builder provides services to bind a property to a embedded DOM element.
 */
export class ReferenceBuilder implements Builder {

    constructor(
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

    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        const selectors = this.selectors
        const isArray = this.isArray
        const isShadow = this.isShadow

        hooks.before('constructorCallback', el => {
            Object.defineProperty(el, this.propName, {
                get(): any {
                    const base = isShadow ? el.shadowRoot : el
                    return isArray ? Array.from(base.querySelectorAll(selectors)) : base.querySelector(selectors)
                }
            })
        })
    }
}
