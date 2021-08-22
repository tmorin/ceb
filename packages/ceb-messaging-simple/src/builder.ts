import {InMemorySimpleBus} from "./bus";
import {AbstractBusBuilder} from "../../ceb-messaging-core";

/**
 * Specialization of {@link AbstractBusBuilder} for the {@link InMemorySimpleBus} bus.
 */
export class SimpleBusBuilder<E extends HTMLElement> extends AbstractBusBuilder<E> {

    /**
     * Provides a fresh builder.
     * @param propName the property name
     * @template E the type of the Custom Element
     */
    static get<E extends HTMLElement>(propName?: string) {
        return new SimpleBusBuilder<E>(
            () => InMemorySimpleBus.GLOBAL,
            propName
        )
    }

}
