import {
    Handler,
    Message,
    MessageAction,
    MessageError,
    MessageEvent,
    MessageHeaders,
    MessageKind,
    MessageResult,
    Subscription
} from "@tmorin/ceb-messaging-core";
import {MessageType} from "@tmorin/ceb-messaging-core/src";

/**
 * The metadata of an IPC message.
 */
export interface IpcMessageMetadata {
    /**
     * When `true`, the execution blocks to wait for a {@link MessageResult}.
     */
    waitForResult?: boolean
    /**
     * It's the max time to wait for a result.
     */
    timeout?: number
    /**
     * It's the action identifier which leads to the {@link MessageResult}.
     */
    correlationId?: string
}

/**
 * An IPC Message contains the information shared between the Main and Renderer contexts.
 * The {@link IpcMessage} are created by {@link IpcMessageConverter}.
 */
export interface IpcMessage<D = any> {
    /**
     * The IPC channel to use.
     */
    channel: string
    /**
     * The data.
     */
    data: D
    /**
     * The metadata.
     */
    metadata: IpcMessageMetadata
}

/**
 * Describe the error which leads to the exection failure of an action.
 */
export class IpcActionError<B extends Error> implements MessageError<B> {
    /**
     * The type of the message.
     */
    static TYPE = "IpcActionError"

    constructor(
        /**
         * The action.
         */
        action: Message,
        /**
         * The error.
         */
        readonly body: B,
        /**
         * Optional headers.
         */
        partialHeaders: Partial<MessageHeaders> = {},
        /**
         * @ignore
         */
        readonly headers: MessageHeaders = {
            ...partialHeaders,
            messageId: `${action.headers.messageId}-error-${Date.now()}`,
            messageType: IpcActionError.TYPE,

            correlationId: action.headers.messageId
        },
        /**
         * @ignore
         */
        readonly kind: MessageKind = MessageKind.error,
    ) {
    }
}

/**
 * The handler of an action managed by a {@link IpcMainBus} or a {@link IpcRendererBus}.
 */
export class IpcHandler<M extends MessageAction, R extends MessageResult> implements Handler {
    constructor(
        private readonly callback: () => void
    ) {
    }

    cancel() {
        this.callback()
    }
}

/**
 * The subscription of an event managed by a {@link IpcMainBus} or a {@link IpcRendererBus}.
 */
export class IpcSubscription<E extends MessageEvent> implements Subscription {
    constructor(
        private readonly callback: () => void
    ) {
    }

    unsubscribe() {
        this.callback()
    }
}
