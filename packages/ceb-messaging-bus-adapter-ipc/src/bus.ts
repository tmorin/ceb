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

export interface IpcMessageMetadata {
    timeout?: number
    correlationId?: string
    waitForResult?: boolean
}

export interface IpcMessage<D = any> {
    channel: string
    data: D
    metadata: IpcMessageMetadata
}

export class IpcMessageError<B extends Error> implements MessageError<B> {
    static NAME = "IpcMessageError"

    constructor(
        origin: Message,
        readonly body: B,
        partialHeaders: Partial<MessageHeaders> = {},
        readonly headers: MessageHeaders = {
            ...partialHeaders,
            messageId: `${origin.headers.messageId}-error-${Date.now()}`,
            messageType: IpcMessageError.NAME,
            correlationId: origin.headers.messageId
        },
        readonly kind: MessageKind = MessageKind.error,
    ) {
    }
}

export interface IpcMessageConverter<D = any> {
    serialize<B = any>(message: Message<B>): IpcMessage<D>

    deserialize<M extends Message>(MessageType: MessageConstructor<M> | string, ipcMessage: IpcMessage<D>): M
}

export class IpcHandler<M extends MessageAction, R extends MessageResult> implements Handler {
    constructor(
        private readonly callback: () => void
    ) {
    }

    cancel() {
        this.callback()
    }
}

export class IpcSubscription<E extends MessageEvent> implements Subscription {
    constructor(
        private readonly callback: () => void
    ) {
    }

    unsubscribe() {
        this.callback()
    }
}

export class SimpleIpcMessageConverter implements IpcMessageConverter<Message> {
    constructor(
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
