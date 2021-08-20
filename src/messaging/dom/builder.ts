import {AbstractBusBuilder} from "../model";
import {DomBus} from "./bus";

/**
 * Specialization of {@link AbstractBusBuilder} for the {@link DomBus} bus.
 */
export class DomBusBuilder<E extends HTMLElement> extends AbstractBusBuilder<E> {

    /**
     * Provides a fresh builder.
     * @param propName the property name
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(propName?: string) {
        return new DomBusBuilder<E>(
            () => new DomBus(window),
            propName
        )
    }

    /**
     * Override the default global target which is `window`.
     * @param target the target
     */
    global(target: EventTarget): DomBusBuilder<E> {
        this._busProvider = () => new DomBus(target)
        return this
    }

}
