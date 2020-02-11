import {Builder} from './builder';
import {toArray} from './utilities';
import {HooksRegistration} from './hook';
import {ElementBuilder} from './element';

/**
 * A event listener.
 */
export interface OnListener {
    (el: HTMLElement, evt: Event, target: Element): void
}

/**
 * A useless function.
 */
const noop = () => {
};

/**
 * Event clauses `[[<name>,<target>]]` => `[['click', 'button'], ['click', 'a.button']]`.
 */
type Clauses = Array<Array<string>>

/**
 * The options of the decorator: `OnBuilder.listen()`.
 */
export interface ListenerOnDecoratorOptions {
    forceCapture?: boolean
    forcePreventDefault?: boolean
    forceStopPropagation?: boolean
    selector?: string
    isShadow?: boolean
}

/**
 * The on builder provides services to listen to DOM events.
 * Listeners are added on connectedCallback and removed on disconnectedCallback.
 */
export class OnBuilder implements Builder {

    constructor(
        private clauses: string,
        private callback: OnListener = noop,
        private forceCapture = false,
        private forcePreventDefault = false,
        private forceStopPropagation = false,
        private selector: string = undefined,
        private isShadow = false
    ) {
    }

    /**
     * Provide a fresh builder.
     * @param clauses the clauses
     */
    static get(clauses: string) {
        return new OnBuilder(clauses);
    }

    /**
     * Method Decorator used to register a listener listening to event changes.
     * @param clauses the clauses
     * @param options the options
     */
    static listen(clauses: string, options: ListenerOnDecoratorOptions = {}) {
        return function (target: any, methName: string, descriptor: PropertyDescriptor) {
            const id = `on-${clauses}`;
            const builder = ElementBuilder.getOrSet(target, id, OnBuilder.get(clauses)).invoke((el, data) => {
                const fn = descriptor.value as Function;
                fn.call(el, data);
            });
            if (options.forceCapture) {
                builder.capture();
            }
            if (options.forcePreventDefault) {
                builder.prevent();
            }
            if (options.forceStopPropagation) {
                builder.stop();
            }
            if (options.isShadow) {
                builder.shadow();
            }
            if (options.selector) {
                builder.delegate(options.selector);
            }
        }
    }

    /**
     * Force the listener execution on the capture phase.
     */
    capture() {
        this.forceCapture = true;
        return this;
    }

    /**
     * Register the listener.
     * @param listener the callback
     */
    invoke(listener: OnListener) {
        this.callback = listener;
        return this;
    }

    /**
     * Force the usage of `preventDefault()` once the event is received.
     */
    prevent() {
        this.forcePreventDefault = true;
        return this;
    }

    /**
     * Force the usage of `stopPropagation()` once the event is received.
     */
    stop() {
        this.forceStopPropagation = true;
        return this;
    }

    /**
     * Apply `.prevent()` and `.stop()`.
     */
    skip() {
        return this.prevent().stop();
    }

    /**
     * Event delegation allows us to attach a single event listener, to a parent element,
     * that will fire for all descendants matching a selector,
     * whether those descendants exist now or are added in the future.
     * <a href="https://learn.jquery.com/events/event-delegation">c.f. JQuery doc</a>
     * @param selector the selector
     */
    delegate(selector: string) {
        this.selector = selector;
        return this;
    }

    /**
     * By default, the builder listen to events from the CustomElement DOM.
     * With this option, the builder will listen to from the attached (and opened) shadow DOM.
     */
    shadow() {
        this.isShadow = true;
        return this;
    }

    build(Constructor: Function, hooks: HooksRegistration) {

        const clauses: Clauses = this.clauses.split(',').map(event => event.trim().split(' '));
        const capture = this.forceCapture;
        const callback = this.callback;
        const selector = this.selector;
        const stopPropagation = this.forceStopPropagation;
        const preventDefault = this.forcePreventDefault;

        hooks.before('connectedCallback', el => {
            const base = this.isShadow ? el.shadowRoot : el;

            const listener = evt => {
                if (selector) {
                    const target = toArray(base.querySelectorAll(selector))
                        .filter((candidate: HTMLElement) => {
                            const isTarget = candidate === evt.target;
                            const isChild = candidate.contains(evt.target);
                            return isTarget || isChild
                        })[0];
                    if (target) {
                        if (stopPropagation) {
                            evt.stopPropagation();
                        }
                        if (preventDefault) {
                            evt.preventDefault();
                        }
                        callback(el, evt, target as HTMLElement);
                    }
                } else {
                    if (stopPropagation) {
                        evt.stopPropagation();
                    }
                    if (preventDefault) {
                        evt.preventDefault();
                    }
                    callback(el, evt, el);
                }
            };

            el['__cebOnHandlers'] = clauses
                .map(([name, target]) => [name, target ? base.querySelector(target) : base])
                .filter(([, target]) => !!target)
                .map(([name, target]) => [target, name, listener, capture])
                .concat(el['__cebOnHandlers'] || []);

            el['__cebOnHandlers'].forEach(([target, name, listener, capture]) => {
                target.addEventListener(name, listener, capture)
            });
        });

        hooks.before('disconnectedCallback', el => {
            el['__cebOnHandlers'].forEach(
                ([target, name, listener, capture]) => target.removeEventListener(name, listener, capture)
            );
            el['__cebOnHandlers'] = [];
        });
    }

}
