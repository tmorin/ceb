import { Message, MessageHeaders } from "./message"
import { EmptyResult, Result } from "./result"

/**
 * The kind of action message.
 */
export type ActionKind = "command" | "query"

/**
 * An action represents an intention to get the state of a system or to mutate it.
 *
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface Action<B = any, H extends MessageHeaders = MessageHeaders> extends Message<B, H> {
  /**
   * The kind of the action.
   */
  kind: ActionKind
}

/**
 * The options to execute an action.
 */
export type ExecuteActionOptions = {
  /**
   * The maximum time in millisecond to wait fore a result.
   */
  timeout: number
}

/**
 * The result of an action.
 *
 * @template R the type of the result
 */
export type ActionResult<R extends Result = Result> = R | EmptyResult
