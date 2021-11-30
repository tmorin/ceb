import {Message, MessageHeaders} from "./message"

/**
 * The kind of a result message.
 */
export type ResultKind = "result"

/**
 * The header of a result message.
 */
export type ResultHeaders = MessageHeaders & {
  originalMessageId: string
}

/**
 * A result is the message providing insight about the execution of a command or a query.
 *
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface Result<B = any, H extends ResultHeaders = ResultHeaders> extends Message<B, H> {
  /**
   * The kind of th result
   */
  kind: ResultKind
}

/**
 * An empty result is a result which doesn't provide any  value.
 *
 * @template H the type of the headers
 */
export interface EmptyResult<H extends ResultHeaders = ResultHeaders> extends Result<undefined, H> {}
