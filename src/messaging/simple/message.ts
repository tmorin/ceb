import {
    Message,
    MessageAction,
    MessageCommand,
    MessageError,
    MessageEvent,
    MessageId,
    MessageQuery,
    MessageResult
} from "../model";

let counter = 0

/**
 * A base class for all _simple_ messages.
 * @template B the type of the body
 */
export abstract class AbstractSimpleMessage<B = any> implements Message<B> {
    protected constructor(
        /**
         * The body.
         */
        readonly body: B,
        /**
         * An optional message id.
         */
        public readonly messageId = `message-${counter++}`
    ) {
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
         * An optional message id.
         */
        messageId?: MessageId,
    ) {
        super(body, messageId)
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
         * An optional message id.
         */
        messageId?: MessageId,
    ) {
        super(body, messageId)
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
         * An optional message id.
         */
        messageId?: MessageId,
    ) {
        super(body, messageId)
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
         * An optional message id.
         */
        messageId?: MessageId,
    ) {
        super(body, messageId)
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
         * An optional message id.
         */
        messageId?: MessageId,
    ) {
        super(body, messageId)
    }
}

/**
 * An helper class defining _simple_ void result.
 */
export class SimpleVoidResult extends AbstractSimpleResult<void> {
    constructor() {
        super();
    }
}

/**
 * An helper class defining _simple_ error result.
 */
export class SimpleErrorResult extends AbstractSimpleResult<Error> implements MessageError {
    constructor(
        /**
         * The error.
         */
        body: Error
    ) {
        super(body);
    }
}
