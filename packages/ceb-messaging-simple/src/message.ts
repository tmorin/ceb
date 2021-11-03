import {
    Message,
    MessageAction,
    MessageCommand,
    MessageError,
    MessageEvent,
    MessageHeaders,
    MessageKind,
    MessageQuery,
    MessageResult
} from "@tmorin/ceb-messaging-core";

let counter = 0

/**
 * A base class for all _simple_ messages.
 * @template B the type of the body
 */
export abstract class AbstractSimpleMessage<B = any> implements Message<B> {
    /**
     * The headers.
     */
    readonly headers: MessageHeaders

    protected constructor(
        /**
         * The body.
         */
        readonly body: B,
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * The kind of the message.
         */
        readonly kind: MessageKind = MessageKind.message,
    ) {
        this.headers = {
            messageId: `message-${counter++}`,
            messageType: this.constructor.name,
            ...partialHeaders,
        }
    }
}

/**
 * A base class for all _simple_ actions.
 * @template B the type of the body
 */
export abstract class AbstractSimpleAction<B = any> extends AbstractSimpleMessage<B> implements MessageAction<B> {
    protected constructor(
        /**
         * The body.
         */
        body: B,
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.action,
    ) {
        super(body, partialHeaders, kind)
    }
}

/**
 * A base class for all _simple_ commands.
 * @template B the type of the body
 */
export abstract class AbstractSimpleCommand<B = any> extends AbstractSimpleAction<B> implements MessageCommand<B> {
    protected constructor(
        /**
         * The body.
         */
        body: B,
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.command,
    ) {
        super(body, partialHeaders, kind)
    }
}

/**
 * A base class for all _simple_ queries.
 * @template B the type of the body
 */
export abstract class AbstractSimpleQuery<B = any> extends AbstractSimpleAction<B> implements MessageQuery<B> {
    protected constructor(
        /**
         * The body.
         */
        body: B,
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.query,
    ) {
        super(body, partialHeaders, kind)
    }
}

/**
 * A base class for all _simple_ events.
 * @template B the type of the body
 */
export abstract class AbstractSimpleEvent<B = any> extends AbstractSimpleMessage<B> implements MessageEvent<B> {
    protected constructor(
        /**
         * The body.
         */
        body: B,
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.event,
    ) {
        super(body, partialHeaders, kind)
    }
}

/**
 * A base class for all _simple_ results.
 * @template B the type of the body
 */
export class AbstractSimpleResult<B = any> extends AbstractSimpleMessage<B> implements MessageResult<B> {
    protected constructor(
        /**
         * The body.
         */
        body: B,
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.result,
    ) {
        super(body, partialHeaders, kind)
    }
}

/**
 * An helper class defining _simple_ void result.
 */
export class SimpleVoidResult extends AbstractSimpleResult<void> {
    constructor(
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.result,
    ) {
        super(undefined, {}, kind);
    }
}

/**
 * An helper class defining _simple_ void result.
 */
export class SimpleErrorResult<B extends Error> extends AbstractSimpleResult<B> implements MessageError<B> {
    constructor(
        /**
         * The body.
         */
        body: B,
        /**
         * The kind of the message.
         */
        kind: MessageKind = MessageKind.error,
    ) {
        super(body, {}, kind);
    }
}
