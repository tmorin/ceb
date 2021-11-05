import {Message, MessageConstructor, MessageType} from "@tmorin/ceb-messaging-core";
import {IpcMessage} from "./bus";

/**
 * The symbol used to register {@link IpcMessageConverter}.
 */
export const IpcMessageConverterSymbol = Symbol.for("ceb/inversion/IpcMessageConverter")

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
     * @param Type the type of the message
     * @param ipcMessage the IPC message
     * @return  message
     */
    deserialize<M extends Message>(Type: MessageConstructor<M> | MessageType, ipcMessage: IpcMessage<D>): M
}

/**
 * Factory of {@link Message}.
 */
export interface MessageFactory {
    /**
     * The factory.
     * @param ipcMessage the IPC message
     */<M extends Message = Message>(ipcMessage: IpcMessage): M
}

/**
 * A simple implementation of the {@link IpcMessageConverter} which expects the bodies of the {@link Message} follow the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).
 * Special cases can be manage providing a map of {@link MessageConstructor}.
 */
export class SimpleIpcMessageConverter implements IpcMessageConverter<Message> {

    constructor(
        /**
         * A a map of Message factories.
         */
        readonly types: Map<MessageConstructor | string, MessageFactory> = new Map()
    ) {
    }

    deserialize<M extends Message>(MessageType: MessageConstructor<M> | string, ipcMessage: IpcMessage<Message>): M {
        if (typeof MessageType === "string" || this.types.has(MessageType)) {
            let factory = this.types.get(MessageType)
            if (factory) {
                return factory(ipcMessage)
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
