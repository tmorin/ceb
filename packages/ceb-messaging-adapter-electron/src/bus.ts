import {
    Handler,
    Message,
    MessageAction,
    MessageConstructor,
    MessageError,
    MessageEvent,
    MessageHeaders,
    MessageKind,
    MessageResult,
    MessageType,
    Subscription
} from "@tmorin/ceb-messaging-core";

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
 * Convert a {@link Message} to an {@link IpcMessage} and vise and versa.
 */
export interface IpcMessageConverter<D = any> {
    /**
     * Transform a message to an IPC message.
     * @param message the message
     * @return the IPC message
     */
    serialize<B = any>(message: Message<B>): IpcMessage<D>

    /**
     * Transform a message to an IPC message.
     * @param MessageType the type of the message
     * @param ipcMessage the IPC message
     * @return  message
     */
    deserialize<M extends Message>(MessageType: MessageConstructor<M> | string, ipcMessage: IpcMessage<D>): M
}

/**
 * A simple implementation of the {@link IpcMessageConverter} which leverages on a map of {@link MessageConstructor}.
 */
export class SimpleIpcMessageConverter implements IpcMessageConverter<Message> {
    constructor(
        /**
         * The map of {@link MessageConstructor}.
         */
        readonly types: Map<MessageType, MessageConstructor<any>> = new Map()
    ) {
    }

    deserialize<M extends Message>(MessageType: MessageConstructor<M> | string, ipcMessage: IpcMessage<Message>): M {
        if (typeof MessageType === "string") {
            let Type = this.types.get(MessageType)
            if (Type) {
                return new Type(ipcMessage.data.body, ipcMessage.data.headers)
            }
            throw new Error(`SimpleIpcMessageConverter : cannot found a constructor for the MessageType ${MessageType}.`)
        }
        return new MessageType(ipcMessage.data.body, ipcMessage.data.headers);
    }

    serialize<B = any>(message: Message<B>): IpcMessage<Message> {
        return {
            channel: message.headers.messageType,
            data: {
                kind: message.kind,
                headers: message.headers,
                body: message.body,
            },
            metadata: {}
        }
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
