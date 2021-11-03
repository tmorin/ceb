import {
    Message,
    MessageAction,
    MessageCommand,
    MessageConstructor,
    MessageError,
    MessageEvent,
    MessageHeaders,
    MessageKind,
    MessageQuery,
    MessageResult,
    MessageType,
} from "@tmorin/ceb-messaging-core";
import {toKebabCase} from "@tmorin/ceb-utilities";

let counter = 0

/**
 * The implementation of a {@link Message} based on a Custom Event.
 */
export class DomMessage<B = any> extends CustomEvent<B> implements Message {
    /**
     * The headers.
     */
    readonly headers: MessageHeaders

    constructor(
        /**
         * The DOM Event type.
         */
        type: MessageType,
        /**
         * The DOM Event options.
         */
        options?: {
            detail?: B
            bubbles?: boolean
            cancelable?: boolean
            composed?: boolean
        },
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * The kind of the message.
         */
        readonly kind: MessageKind = MessageKind.message,
    ) {
        super(type, options)
        this.headers = {
            messageId: `message-${counter++}`,
            messageType: type,
            ...partialHeaders,
        }
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
        /**
         * The DOM Event type.
         */
        type: MessageType,
        /**
         * The body of the message.
         */
        body: B,
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.event,
    ) {
        super(type, {
            detail: body,
            bubbles: false,
            cancelable: false,
            composed: false
        }, {}, kind);
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageAction}.
 *
 * The implemented Custom Event bubbles and can be canceled.
 */
export abstract class DomAction<B = any> extends DomMessage<B> implements MessageAction<B> {
    protected constructor(
        /**
         * The DOM Event type.
         */
        type: MessageType,
        /**
         * The body of the message.
         */
        body: B,
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.action,
    ) {
        super(type, {
            detail: body,
            bubbles: true,
            cancelable: true,
            composed: false
        }, {}, kind);
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageCommand}.
 */
export class DomCommand<B = any> extends DomAction<B> implements MessageCommand<B> {
    constructor(
        /**
         * The DOM Event type.
         */
        type: MessageType,
        /**
         * The body of the message.
         */
        body: B,
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.command,
    ) {
        super(type, body, kind);
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageQuery}.
 */
export class DomQuery<B = any> extends DomAction<B> implements MessageQuery<B> {
    constructor(
        /**
         * The DOM Event type.
         */
        type: MessageType,
        /**
         * The body of the message.
         */
        body: B,
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.query,
    ) {
        super(type, body, kind);
    }
}

/**
 * An extension of {@link DomMessage} implementing {@link @MessageResult}.
 *
 * The implemented Custom Event doesn't bubbles and cannot be canceled.
 */
export class DomResult<B = any> extends DomMessage<B> implements MessageResult<B> {
    constructor(
        /**
         * The DOM Event type.
         */
        type: MessageType,
        /**
         * The original message.
         */
        origin: MessageAction,
        /**
         * The body of the message.
         */
        body: B,
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.result,
        /**
         * The correlation identifier.
         */
        correlationId = origin.headers.messageId,
    ) {
        super(type, {
            detail: body,
            bubbles: false,
            cancelable: false,
            composed: false
        }, {
            correlationId
        }, kind);
    }
}

/**
 * An extension of {@link DomResult} implementing {@link @DomMessage} but with a `void` body.
 *
 * The implemented Custom Event doesn't bubbles and cannot be canceled.
 */
export class DomVoidResult extends DomResult<void> implements MessageResult<void> {
    constructor(
        /**
         * The original message.
         */
        origin: MessageAction
    ) {
        super(DomVoidResult.name, origin);
    }
}

/**
 * An extension of {@link DomResult} implementing {@link @MessageError}.
 *
 * The implemented Custom Event doesn't bubbles and cannot be canceled.
 */
export class DomError<B extends Error> extends DomResult<B> implements MessageError<B> {
    constructor(
        /**
         * The DOM Event type.
         */
        type: MessageType,
        /**
         * The original message.
         */
        origin: MessageAction,
        /**
         * The body of the message.
         */
        body: B,
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.error,
    ) {
        super(type, origin, body, kind);
    }
}
