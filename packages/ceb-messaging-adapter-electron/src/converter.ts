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
