/**
 * The identifier of a message.
 */
export type MessageId = string

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
 */
export interface Message<B = any> {
    readonly messageId: MessageId
    readonly body: B
}

/**
 * An action is a message which expects a result.
 * It can be to mutate the system, c.f. {@link MessageCommand} or request a view of the system state, c.f. {@link MessageQuery}.
 * @template B the type of the body
 */
export interface MessageAction<B = any> extends Message<B> {
}

/**
 * The type of an action is its class or a string
 */
export type MessageActionType<M extends MessageAction = MessageAction> = MessageConstructor<M> | string

/**
 * A command is a message which triggers an action which can leads to side effects on the system state.
 * @template B the type of the body
 */
export interface MessageCommand<B = any> extends MessageAction<B> {
}

/**
 * The type of a command is the class or its related Custom-Event's type
 */
export type MessageCommandType<M extends MessageCommand = MessageCommand> = MessageConstructor<M> | string

/**
 * A query is a message which requests a view of the system state.
 * @template B the type of the body
 */
export interface MessageQuery<B = any> extends MessageAction<B> {
}

/**
 * The type of a query is the class or its related Custom-Event's type
 */
export type MessageQueryType<M extends MessageQuery = MessageQuery> = MessageConstructor<M> | string

/**
 * A result is the message providing insight about the execution of a command or a query.
 * @template B the type of the body
 */
export interface MessageResult<B = any> extends Message<B> {
}

/**
 * The type of a result is the class or its related Custom-Event's type
 */
export type MessageResultType<M extends MessageResult = MessageResult> = MessageConstructor<M> | string

/**
 * An error is a result describing the failure of the execution.
 * @template B the type of the error
 */
export interface MessageError<B extends Error = Error> extends MessageResult<B> {
}

/**
 * The type of an error is the class or its related Custom-Event's type
 */
export type MessageErrorType<M extends MessageError = MessageError> = MessageConstructor<M> | string

/**
 * An event is a message which describes something which happened in the past.
 * @template B the type of the body
 */
export interface MessageEvent<B = any> extends Message<B> {
}

/**
 * The type of an event is its class or a string
 */
export type MessageEventType<M extends MessageEvent = MessageEvent> = MessageConstructor<M> | string
