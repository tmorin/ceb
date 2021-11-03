/**
 * The identifier of a message.
 */
export type MessageId = string

/**
 * The identifier of a message.
 */
export type MessageType = string

/**
 * The kind of a message.
 */
export enum MessageKind {
    message = "message",
    action = "action",
    command = "command",
    query = "query",
    result = "result",
    error = "error",
    event = "event",
}

/**
 * The name of a message.
 */
export interface MessageHeaders {
    messageType: MessageType
    messageId: MessageId

    [key: string]: string | number
}

/**
 * The constructor of a message.
 * @template M the type of the message
 */
export interface MessageConstructor<M extends Message = Message> {
    new(...args: any[]): M
}

/**
 * A message is an information which can be identified.
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface Message<B = any, H extends MessageHeaders = MessageHeaders> {
    readonly kind: MessageKind
    readonly headers: H
    readonly body: B
}

/**
 * An action is a message which expects a result.
 * It can be to mutate the system, c.f. {@link MessageCommand} or request a view of the system state, c.f. {@link MessageQuery}.
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface MessageAction<B = any, H extends MessageHeaders = MessageHeaders> extends Message<B, H> {
}

/**
 * A command is a message which triggers an action which can leads to side effects on the system state.
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface MessageCommand<B = any, H extends MessageHeaders = MessageHeaders> extends MessageAction<B, H> {
}

/**
 * A query is a message which requests a view of the system state.
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface MessageQuery<B = any, H extends MessageHeaders = MessageHeaders> extends MessageAction<B, H> {
}

/**
 * A result is the message providing insight about the execution of a command or a query.
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface MessageResult<B = any, H extends MessageHeaders = MessageHeaders> extends Message<B, H> {
}

/**
 * An error is a result describing the failure of the execution.
 * @template B the type of the error
 * @template H the type of the headers
 */
export interface MessageError<B extends Error = Error, H extends MessageHeaders = MessageHeaders> extends MessageResult<B, H> {
}

/**
 * An event is a message which describes something which happened in the past.
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface MessageEvent<B = any, H extends MessageHeaders = MessageHeaders> extends Message<B, H> {
}
