import {
    Message,
    MessageAction,
    MessageCommand,
    MessageCommandType,
    MessageConstructor,
    MessageError,
    MessageErrorType,
    MessageEvent,
    MessageEventType,
    MessageQuery,
    MessageQueryType,
    MessageResult,
    MessageResultType
} from "../model";
import {toKebabCase} from "../../utilities";

let counter = 0

/**
 * The implementation of a {@link Message} based on a Custom Event.
 */
export class DomMessage<B = any> extends CustomEvent<B> implements Message {

    constructor(
        Type: MessageConstructor | string,
        options?: {
            detail?: B
            bubbles?: boolean
            cancelable?: boolean
            composed?: boolean
        },
        public readonly messageId = `message-${counter++}`
    ) {
        super(
            typeof Type === "string" ? Type : DomMessage.toName(Type),
            options
        );
    }

    get body() {
        return this.detail
    }

    static toName(value: MessageConstructor | string): string {
        return toKebabCase(typeof value === "string" ? value : value.name)
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageEvent}.
 *
 * The implemented Custom Event doesn't bubble and cannot be canceled.
 */
export class DomEvent<B = any> extends DomMessage<B> implements MessageEvent<B> {
    constructor(
        Type: MessageEventType,
        body: B
    ) {
        super(Type, {
            detail: body,
            bubbles: false,
            cancelable: false,
            composed: false
        });
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageAction}.
 *
 * The implemented Custom Event bubbles and can be canceled.
 */
export abstract class DomAction<B = any> extends DomMessage<B> implements MessageAction<B> {
    protected constructor(
        Type: MessageConstructor | string,
        body: B
    ) {
        super(Type, {
            detail: body,
            bubbles: true,
            cancelable: true,
            composed: false
        });
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageCommand}.
 */
export class DomCommand<B = any> extends DomAction<B> implements MessageCommand<B> {
    constructor(
        Type: MessageCommandType,
        body: B
    ) {
        super(Type, body);
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageQuery}.
 */
export class DomQuery<B = any> extends DomAction<B> implements MessageQuery<B> {
    constructor(
        Type: MessageQueryType,
        body: B
    ) {
        super(Type, body);
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageResult}.
 *
 * The implemented Custom Event doesn't bubbles and cannot be canceled.
 */
export class DomResult<B = any> extends DomMessage<B> implements MessageResult<B> {
    constructor(
        Type: MessageResultType,
        origin: MessageAction,
        body: B,
        readonly correlationId = origin.messageId
    ) {
        super(Type, {
            detail: body,
            bubbles: false,
            cancelable: false,
            composed: false
        });
    }

    isCorrelatedTo(message: Message): boolean {
        return message.messageId === this.correlationId
    }
}

/**
 * An extension of {@link DomResult} implementing {@link @DomMessage} but with a `void` body.
 *
 * The implemented Custom Event doesn't bubbles and cannot be canceled.
 */
export class DomVoidResult extends DomResult<void> implements MessageResult<void> {
    constructor(
        origin: MessageAction
    ) {
        super(DomVoidResult, origin);
    }
}

/**
 * An extension of {@link DomResult} implementing {@link @MessageError}.
 *
 * The implemented Custom Event doesn't bubbles and cannot be canceled.
 */
export class DomError<B extends Error> extends DomResult<B> implements MessageError<B> {
    constructor(
        Type: MessageErrorType,
        origin: MessageAction,
        body: B
    ) {
        super(Type, origin, body);
    }
}
