/**
 * The kind of a message.
 */
export type MessageKind = "command" | "query" | "result" | "event";

/**
 * The identifier of a message.
 */
export type MessageId = string;

/**
 * The type of a message.
 */
export type MessageType = string;

/**
 * The value of a header.
 */
export type MessageHeaderValue = string | number | Array<string | number>;

/**
 * The headers of the a message.
 */
export type MessageHeaders = {
    /**
     * The type of the message.
     */
    messageType: MessageType;
    /**
     * The identifier of the message.
     */
    messageId: MessageId;
    [key: string]: MessageHeaderValue;
};

/**
 * A Message is an atomic packet of data that can be transmitted on a channel.
 */
export interface Message<B = any, H extends MessageHeaders = MessageHeaders> {
    /**
     * The kind of the message.
     */
    kind: MessageKind;
    /**
     * The headers of the message.
     */
    headers: H;
    /**
     * The body of the message.
     */
    body: B;
}
