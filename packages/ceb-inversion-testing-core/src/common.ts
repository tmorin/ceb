import {Container, ContainerBuilder} from "@tmorin/ceb-inversion";

/**
 * A provider of {@link ContainerBuilder}
 */
export interface ContainerBuilderProvider {
    (): ContainerBuilder
}

/**
 * A callback which provide a {@link ContainerBuilder}.
 */
export interface CallbackWithContainerBuilder {
    /**
     * @param builder the builder
     */
    (builder: ContainerBuilder): any
}

/**
 * A callback which provide a {@link Container}.
 */
export interface CallbackWithContainer {
    /**
     * @param container the container
     */
    (container: Container): any
}

/**
 * A simple callback.
 */
export interface Callback {
    (): any
}
