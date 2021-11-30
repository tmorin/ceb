import {Builder, CustomElementConstructor, ElementBuilder, HooksRegistration} from "@tmorin/ceb-elements-core";

/**
 * A factory which produces the initial HTML content of a Custom Element.
 */
export interface ContentFactory<E extends Element> {
    /**
     * The factory function.
     * @template E the type of the Custom Element
     * @param el the Custom Element
     */
    (el: E): string
}

/**
 * The builder handles the initialization of the HTML content of the Custom Element.
 *
 * The content can be provided as a string value or a factory function (c.f. {@link ContentFactory}) when the builder is created with {@link ContentBuilder.get}.
 *
 * By default, the builder injects the content as children of the Custom Element into the Light DOM on the lifecycle callback `connectedCallback`.
 * However, the builder can inject the content within the Shadow DOM with {@link ContentBuilder.shadow}.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link ContentBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 */
export class ContentBuilder<E extends HTMLElement = HTMLElement> implements Builder<E> {

    private constructor(
        private _content: string | ContentFactory<E>,
        private _isShadow = false,
        private _isFocusDelegation?: boolean
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param content the initial content
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(content: string | ContentFactory<E>) {
        return new ContentBuilder<E>(content)
    }

    /**
     * Forces the content injection into the Shadow DOM.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {ContentBuilder} from "@tmorin/ceb-elements-builders"
     * class HelloWorld extends HTMLElement {
     * }
     * ElementBuilder.get().builder(
     *     ContentBuilder.get(`Hello, World!`).shadow()
     * ).register()
     * ```
     *
     * @param focus when `true`, the focus is delegated to the shadow DOM
     */
    shadow(focus?: boolean) {
        this._isShadow = true
        this._isFocusDelegation = focus
        return this
    }

    /**
     * Decorate the Custom Element class.
     *
     * @example
     * ```typescript
     * import {ElementBuilder} from "@tmorin/ceb-elements-core"
     * import {ContentBuilder} from "@tmorin/ceb-elements-builders"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * @ContentBuilder.get(`Hello, World!`).decorate()
     * class HelloWorld extends HTMLElement {
     * }
     * ```
     */
    decorate(): ClassDecorator {
        return (constructor) => {
            const id = 'content'
            ElementBuilder.getOrSet(constructor.prototype, this, id)
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E & { __ceb_content_default_html?: string }>) {
        if (!this._content) {
            throw new TypeError("ContentBuilder - the content is missing")
        }

        hooks.before('constructorCallback', el => {
            // resolve the HTML content
            const html: string = typeof this._content === 'function' ? this._content(el) : this._content

            if (this._isShadow) {
                // creates and initializes the shadow root
                const shadowRoot = el.shadowRoot || el.attachShadow({
                    mode: 'open',
                    delegatesFocus: this._isFocusDelegation
                })
                shadowRoot.innerHTML = html
            } else {
                // keep the HTML content, for the first `connectedCallback`
                el.__ceb_content_default_html = html
            }
        })

        hooks.before('connectedCallback', el => {
            if (el.__ceb_content_default_html) {
                // resolve the HTML content and injects it
                el.innerHTML = el.__ceb_content_default_html
                // delete the resolved HTML content to avoid overrides
                delete el.__ceb_content_default_html
            }
        })
    }

}
