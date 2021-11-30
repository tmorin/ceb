import {Action, MessageBuilder, Removable, Result} from "@tmorin/ceb-messaging-core"

/**
 * The metadata of an IPC message.
 */
export interface IpcMessageMetadata {
    /**
     * When `true`, the execution blocks to wait for a {@link Result}.
     */
    waitForResult?: boolean
    /**
     * It's the max time to wait for a result.
     */
    timeout?: number
    /**
     * It's the action identifier which leads to the {@link Result}.
     */
    correlationId?: string
}

/**
 * Create a {@link Removable} with a callback
 * @param callback the callback
 */
export function createRemovable(callback: () => any): Removable {
    return {
        remove() {
            callback()
        }
    }
}

/**
 * Create an Error Result.
 * @param action the action
 * @param error the error
 */
export function createErrorResult(action: Action, error: any): Result<Error> {
    if (error instanceof Error) {
        return MessageBuilder.result(action, "error").body(error).build()
    }
    return MessageBuilder.result(action, "error").body(new Error(error?.toString())).build()
}

/**
 * The type of the Error Result.
 */
createErrorResult.MESSAGE_TYPE = "error"

/**
 * The IPC channel for commands and their results.
 */
export const IPC_CHANNEL_COMMANDS = "commands"

/**
 * The IPC channel for queries and their results.
 */
export const IPC_CHANNEL_QUERIES = "queries"

/**
 * The IPC channel for events.
 */
export const IPC_CHANNEL_EVENTS = "events"
