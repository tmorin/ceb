import {Builder, CustomElementConstructor} from "../builder";
import {ElementBuilder} from "../element";
import {HooksRegistration} from "../hook";
import {Engine} from "./engine";

/**
 * The common parameters of the rendering.
 */
export type TemplateParameters = {
    /**
     * When true, the rendering solution render the template with a _scope_.
     */
    greyDom: boolean
}

/**
 * A template updates the children of an element.
 * @template P The type of the template parameters.
 */
export interface Template<P = any> {
    /**
     * Render the template.
     * @param destination the destination node
     * @param parameters the parameters of the rendering
     */
    render(destination: DocumentFragment | Element, parameters?: TemplateParameters & P): void
}

/**
 * The builder handles the integration of a templating solution to update the content of the Custom Element.
 *
 * Firstly, the integration of the templating solution has to be defined in a method, by default the method name is `render`.
 * The implementation of the method (i.e. the method `render`) must return an instance of {@link Template}.
 *
 * Secondly, the render method is wrapped by the builder in order to render the {@link Template} once returned.
 * That means, each time the render method is invoked, the returned {@link Template} is rendered automatically.
 * The wrapping is also responsible to select the right destination of the template: Light DOM vs Shadow DOM.
 *
 * By default, the template is rendered into the Light DOM of the Custom Element.
 * However, the builder can render the template into the Shadow DOM with {@link TemplateBuilder.shadow}.
 * Another switch, {@link TemplateBuilder.grey} can be used to force the rendering into a _scope_.
 *
 * If the _scope_ is not required, the Custom Element content can be simply preserve from ancestral rendering process with {@link TemplateBuilder.preserveContent}.
 *
 * Attributes can also be preserved from ancestral rendering process with {@link TemplateBuilder.preserveAttributes}.
 *
 * By default, the name of the wrapped method is `render`.
 * However, the name can be changed with {@link TemplateBuilder.method}.
 *
 * When a {@link Template} is rendered, template parameters can be provided to the {@link Template.render} method.
 * The template parameters can be set with {@link TemplateBuilder.parameters}.
 *
 * The library provides a built-in template solution: {@link html}.
 *
 * Finally, the builder can be registered using the method {@link ElementBuilder.builder} of the main builder (i.e. {@link ElementBuilder}).
 * However, it can also be registered with the decorative style using the decorator {@link TemplateBuilder.decorate}.
 *
 * @template E the type of the Custom Element
 * @template P The type of the template parameters.
 */
export class TemplateBuilder<E extends HTMLElement, P> implements Builder<E> {

    private constructor(
        private _isGrey = false,
        private _preserveContent = false,
        private _preserveAttributes: Array<string> = [],
        private _isShadow = false,
        private _isFocusDelegation?: boolean,
        private _methName = "render",
        private _parameters?: P,
    ) {
    }

    /**
     * Provides a fresh builder.
     * @template E the type of the Custom Element
     * @template P The type of the template parameters.
     */
    static get<E extends HTMLElement, P>() {
        return new TemplateBuilder<E, P>()
    }

    /**
     * Forces the rendering into the Shadow DOM.
     *
     * ${@link TemplateBuilder.shadow} and ${@link TemplateBuilder.grey} are exclusives.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, TemplateBuilder, html} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     render() {
     *         return html`Hello, ${this.value}!`
     *     }
     * }
     * ElementBuilder.get().builder(
     *     TemplateBuilder.get().shadow()
     * ).register()
     * ```
     *
     * @param focus when true the focus will be delegated to the shadow DOM
     */
    shadow(focus?: boolean) {
        this._isGrey = false
        this._isShadow = true
        this._isFocusDelegation = focus
        return this
    }

    /**
     * Forces the rendering into the Grey DOM.
     *
     * ${@link TemplateBuilder.shadow} and ${@link TemplateBuilder.grey} are exclusives.
     * ${@link TemplateBuilder.preserveContent} and ${@link TemplateBuilder.grey} are exclusives.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, TemplateBuilder, html} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     render() {
     *         return html`Hello, ${this.value}!`
     *     }
     * }
     * ElementBuilder.get().builder(
     *     TemplateBuilder.get().grey()
     * ).register()
     * ```
     */
    grey() {
        this._isGrey = true
        this._isShadow = false
        this._isFocusDelegation = undefined
        return this
    }

    /**
     * Prevent mutations on the Custom Element content from rendering processes coming from ancestors.
     *
     * ${@link TemplateBuilder.preserveContent} and ${@link TemplateBuilder.grey} are exclusives.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, TemplateBuilder, html} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     render() {
     *         return html`Hello, ${this.value}!`
     *     }
     * }
     * ElementBuilder.get().builder(
     *     TemplateBuilder.get().preserveContent()
     * ).register()
     * ```
     */
    preserveContent() {
        this._preserveContent = true
        return this
    }

    /**
     * Preserve attributes of the Custom Element from rendering processes coming from ancestors.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, TemplateBuilder, html} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     render() {
     *         return html`Hello, ${this.value}!`
     *     }
     * }
     * ElementBuilder.get().builder(
     *     TemplateBuilder.get().preserveAttributes("class", "id")
     * ).register()
     * ```
     *
     * @param names the names of the attribute
     */
    preserveAttributes(...names: Array<string>) {
        this._preserveAttributes = this._preserveAttributes.concat(names)
        return this
    }

    /**
     * Overrides the default render method name.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, TemplateBuilder, html} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     doRender() {
     *         return html`Hello, ${this.value}!`
     *     }
     * }
     * ElementBuilder.get().builder(
     *     TemplateBuilder.get().method("doRender")
     * ).register()
     * ```
     *
     * @param methName the render method name
     */
    method(methName: string) {
        this._methName = methName
        return this
    }

    /**
     * Set render parameters.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, TemplateBuilder, html, UpdateParameters} from "ceb"
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     doRender() {
     *         return html`Hello, ${this.value}!`
     *     }
     * }
     * ElementBuilder.get().builder(
     *     TemplateBuilder.get<UpdateParameters>()
     *         .parameters({ greyDom: true })
     * ).register()
     * ```
     *
     * @param parameters the parameters
     */
    parameters(parameters: P) {
        this._parameters = parameters
        return this
    }

    /**
     * Decorates the render method.
     *
     * @example
     * ```typescript
     * import {ElementBuilder, TemplateBuilder, html} from "ceb"
     * @ElementBuilder.get<HelloWorld>().decorate()
     * class HelloWorld extends HTMLElement {
     *     value = "World"
     *     @TemplateBuilder.get().decorate()
     *     render() {
     *         return html`Hello, ${this.value}!`
     *     }
     * }
     * ```
     */
    decorate<E extends HTMLElement>(): MethodDecorator {
        return (target: Object, methName: string | symbol, _: PropertyDescriptor) => {
            if (!this._methName) {
                this._methName = methName.toString()
            }
            const id = 'template'
            ElementBuilder.getOrSet(target, this, id)
        }
    }

    /**
     * This API is dedicated for developer of Builders.
     * @protected
     */
    build(Constructor: CustomElementConstructor<E>, hooks: HooksRegistration<E & {
        [key: string]: any,
        __ceb_engine_preserve_children?: boolean,
        __ceb_engine_preserve_attributes?: Array<string>
    }>) {
        hooks.before('constructorCallback', (el) => {
            if (this._preserveContent) {
                el[Engine.PROP_NAME_PRESERVE_CHILDREN] = true
            }
            if (this._preserveAttributes.length > 0) {
                if (!el[Engine.PROP_NAME_PRESERVE_ATTRIBUTES]) {
                    el[Engine.PROP_NAME_PRESERVE_ATTRIBUTES] = []
                }
                el[Engine.PROP_NAME_PRESERVE_ATTRIBUTES] = el[Engine.PROP_NAME_PRESERVE_ATTRIBUTES]?.concat(this._preserveAttributes)
            }
            // wrap the default render function to render the template in call
            if (typeof el[this._methName] === 'function') {
                const _original: Function = el[this._methName]
                const _isShadow = this._isShadow;
                const _greyDom = this._isGrey;
                const _parameters = this._parameters
                Object.defineProperty(el, this._methName, {
                    configurable: true,
                    enumerable: true,
                    writable: false,
                    value: function (): Template<P> {
                        const template: Template<P> = _original.apply(el, arguments)
                        template.render(
                            _isShadow && el.shadowRoot ? el.shadowRoot : el,
                            Object.assign({greyDom: _greyDom}, _parameters)
                        )
                        return template
                    }
                })
            }

            if (this._isShadow && !el.shadowRoot) {
                // creates and initializes the shadow root
                el.attachShadow({mode: 'open', delegatesFocus: this._isFocusDelegation})
            }
        })

        hooks.before('connectedCallback', el => {
            if (typeof el[this._methName] === "function") {
                el[this._methName]()
            }
        })
    }

}
