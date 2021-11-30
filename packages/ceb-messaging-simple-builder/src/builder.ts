import {SimpleGateway} from "@tmorin/ceb-messaging-simple"
import {AbstractGatewayBuilder} from "@tmorin/ceb-messaging-builder-core"

/**
 * Specialization of {@link AbstractGatewayBuilder} for the {@link SimpleGateway} gateway.
 */
export class SimpleGatewayBuilder<E extends HTMLElement> extends AbstractGatewayBuilder<E> {
  /**
   * Provides a fresh builder.
   * @param propName the property name
   * @template E the type of the Custom Element
   */
  static get<E extends HTMLElement>(propName?: string) {
    return new SimpleGatewayBuilder<E>(() => SimpleGateway.GLOBAL, propName)
  }
}
