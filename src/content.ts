import {Builder, CustomElementConstructor} from './builder'
import {HooksRegistration} from './hook'
import {ElementBuilder} from './element'

/**
 * A content factory.
 */
export interface ContentFactory {
    <T extends Element>(el: T): string
}

/**
 * The options of the decorator {@link ContentBuilder.content}.
 */
export type ContentDecoratorOptions<T extends Element> = {
    /**
     * The initial content.
     */
    content?: string | ContentFactory
    /**
     * By default, the content is appended as child of the CustomElement.
     * With this options, an opened shadow DOM will be attached and the content append to it.
     */
    isShadow?: boolean
    /**
     * With this option the focus will be delegated to the shadow DOM.
     */
    isShadowWithFocusDelegation?: boolean
}

/**
 * The builder provides services to initialize the HTML content of the CustomElement.
 *
 * @example With the builder API - Initialize the element content
 * ```typescript
 * import {ElementBuilder, ContentBuilder} from "ceb"
 * class HelloWorld extends HTMLElement {
 * }
 * ElementBuilder.get().builder(
 *     ContentBuilder.get(`Hello, World!`)
 * ).register()
 * ```
 *
 * @example With the decorator API - Initialize the element content
 * ```typescript
 * import {ElementBuilder, ContentBuilder} from "ceb"
 * @ElementBuilder.element()
 * @ContentBuilder.content(`Hello, World!`)
 * class HelloWorld extends HTMLElement {
 * }
 */
export class ContentBuilder implements Builder {

    private constructor(
        private content: string | ContentFactory,
        private isShadow = false,
        private isFocusDelegation?: boolean
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param content the initial content
     */
    static get(content: string | ContentFactory) {
        return new ContentBuilder(content)
    }

    /**
     * Class decorator used to define a content.
     * @param options the options
     */
    static content<T extends HTMLElement>(options: ContentDecoratorOptions<T> = {}) {
        return function (constructor: CustomElementConstructor<T>) {
            const id = 'content'
            const builder = ElementBuilder.getOrSet(constructor.prototype, id, ContentBuilder.get(options.content || ''))
            if (options.isShadow) {
                builder.shadow(options.isShadowWithFocusDelegation)
            }
        }
    }

    /**
     * By default, the content is appended as child of the CustomElement,
     * With this options, an opened shadow DOM will be attached and the content append to it.
     * @param focus when true the focus will be delegated to the shadow DOM
     */
    shadow(focus?: boolean) {
        this.isShadow = true
        this.isFocusDelegation = focus
        return this
    }

    /**
     * The is API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        const defaultHtmlPropName = '__ceb_content_default_html'

        hooks.before('constructorCallback', el => {
            // resolve the HTML content
            const html: string = typeof this.content === 'function' ? this.content(el) : this.content

            if (this.isShadow) {
                // creates and initializes the shadow root
                el.attachShadow({mode: 'open', delegatesFocus: this.isFocusDelegation})
                el.shadowRoot.innerHTML = html
            } else {
                // keep the HTML content, for the first `connectedCallback`
                el[defaultHtmlPropName] = html
            }
        })

        hooks.before('connectedCallback', el => {
            if (el[defaultHtmlPropName]) {
                // resolve the HTML content and injects it
                el.innerHTML = el[defaultHtmlPropName]
                // delete the resolved HTML content to avoid overrides
                delete el[defaultHtmlPropName]
            }
        })
    }

}
