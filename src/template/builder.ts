import {Builder, CustomElementConstructor} from "../builder";
import {UpdateElementParameters} from "./engine";
import {ElementBuilder} from "../element";
import {HooksRegistration} from "../hook";
import {Template} from "./literal";

/**
 * The options of the decorator {@link TemplateBuilder.template}.
 */
export type TemplateDecoratorOptions<T extends HTMLElement> = {
    /**
     * By default, the template is appended as child of the CustomElement,
     * With this options, an opened shadow DOM will be attached and the template append to it.
     */
    isShadow?: boolean
    /**
     * With this option the focus will be delegated to the shadow DOM.
     */
    isShadowWithFocusDelegation?: boolean
    /**
     * The name of the method which implement the render process, by default it is `render()`.
     */
    methName?: string
}

/**
 * The builder provides services to patch the HTML content of the CustomElement.
 *
 * @example With the builder API - Render the content with {@link html}
 * ```typescript
 * import {ElementBuilder, TemplateBuilder} from "ceb"
 * class HelloWorld extends HTMLElement {
 *     value = "World"
 *     render() {
 *         return html`Hello, ${this.value}!`
 *     }
 * }
 * ElementBuilder.get().builder(
 *     TemplateBuilder.get()
 * ).register()
 * ```
 *
 * @example With the decorator API - Render the content with {@link html}
 * ```typescript
 * import {ElementBuilder, TemplateBuilder} from "ceb"
 * @ElementBuilder.element()
 * class HelloWorld extends HTMLElement {
 *     value = "World"
 *     @TemplateBuilder.template()
 *     render() {
 *         return html`Hello, ${this.value}!`
 *     }
 * }
 * ```
 */
export class TemplateBuilder implements Builder {

    constructor(
        private isShadow = false,
        private isFocusDelegation?: boolean,
        private methName: string = "render",
        private templateOptions: UpdateElementParameters = {},
    ) {
    }

    /**
     * Provide a fresh builder.
     */
    static get() {
        return new TemplateBuilder()
    }

    /**
     * Method decorator used to define a template.
     * @param options the options
     */
    static template<T extends HTMLElement>(options: TemplateDecoratorOptions<T> = {}) {
        return function (target: any, methName: string, _: PropertyDescriptor) {
            const id = 'template'
            const builder = ElementBuilder.getOrSet(target, id, TemplateBuilder.get().method(methName))
            if (options.isShadow) {
                builder.shadow(options.isShadowWithFocusDelegation)
            }
        }
    }

    /**
     * By default, the template is appended as child of the CustomElement,
     * With this options, an opened shadow DOM will be attached and the template append to it.
     * @param focus when true the focus will be delegated to the shadow DOM
     */
    shadow(focus?: boolean) {
        this.isShadow = true
        this.isFocusDelegation = focus
        return this
    }

    /**
     * Override the default render method name.
     * @param methName the render method name
     */
    method(methName: string) {
        this.methName = methName
        return this
    }

    /**
     * Override the default render options.
     * @param options the render options
     */
    options(options: UpdateElementParameters) {
        this.templateOptions = options
        return this
    }

    /**
     * The is API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        hooks.before('constructorCallback', el => {
            // wrap the default render function to render the template in call
            if (typeof el[this.methName] === 'function') {
                const original: Function = el[this.methName]
                const options = this.templateOptions
                el[this.methName] = function (): Template {
                    const template: Template = original.apply(el, arguments)
                    template.render(el, options)
                    return template
                }
            }

            if (this.isShadow) {
                // creates and initializes the shadow root
                el.attachShadow({mode: 'open', delegatesFocus: this.isFocusDelegation})
            }
        })

        hooks.before('connectedCallback', el => {
            if (typeof el[this.methName] === "function") {
                el[this.methName]()
            }
        })
    }

}
