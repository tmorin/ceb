import {Builder, CustomElementConstructor} from './builder';
import {HooksRegistration} from './hook';
import {ElementBuilder} from './element';

/**
 * A content factory.
 */
export interface ContentFactory {
    <T extends HTMLElement>(el: T): string
}

/**
 * The options of the decorator: `TemplateBuilder.template()`.
 */
export interface TemplateDecoratorOptions<T extends HTMLElement> {
    /**
     * The initial content.
     */
    content?: string | ContentFactory
    /**
     * By default, the template is appended as child of the CustomElement,
     * With this options, an opened shadow DOM will be attached and the template append to it.
     */
    isShadow?: boolean
    /**
     * With this option the focus will be delegated to the shadow DOM.
     */
    isShadowWithFocusDelegation?: boolean
}

/**
 * The template builder provides services to initialize the HTML content of the CustomElement.
 */
export class TemplateBuilder implements Builder {

    constructor(
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
        return new TemplateBuilder(content);
    }

    /**
     * Class decorator used to define a template.
     * @param options the options
     */
    static template<T extends HTMLElement>(options: TemplateDecoratorOptions<T> = {}) {
        return function (constructor: CustomElementConstructor<T>) {
            const id = 'template';
            const builder = ElementBuilder.getOrSet(constructor.prototype, id, TemplateBuilder.get(options.content || ''));
            if (options.isShadow) {
                builder.shadow(options.isShadowWithFocusDelegation);
            }
        }
    }

    /**
     * By default, the template is appended as child of the CustomElement,
     * With this options, an opened shadow DOM will be attached and the template append to it.
     * @param focus when true the focus will be delegated to the shadow DOM
     */
    shadow(focus?: boolean) {
        this.isShadow = true;
        this.isFocusDelegation = focus;
        return this;
    }

    build(Constructor: CustomElementConstructor<HTMLElement>, hooks: HooksRegistration) {
        const defaultHtmlPropName = '__cebTemplateDefaultHtml';

        hooks.before('constructorCallback', el => {
            // resolve the HTML content
            const html: string = typeof this.content === 'function' ? this.content(el) : this.content;

            if (this.isShadow) {
                // creates and initializes the shadow root
                el.attachShadow({mode: 'open', delegatesFocus: this.isFocusDelegation});
                el.shadowRoot.innerHTML = html;
            } else {
                // keep the HTML content, for the first `connectedCallback`
                el[defaultHtmlPropName] = html;
            }
        });

        hooks.before('connectedCallback', el => {
            if (el[defaultHtmlPropName]) {
                // resolve the HTML content and injects it
                el.innerHTML = el[defaultHtmlPropName];
                // delete the resolved HTML content to avoid overrides
                delete el[defaultHtmlPropName];
            }
        });
    }

}
