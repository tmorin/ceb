import { MessageHeaders } from "./message"
import { Action, ActionResult, ExecuteActionOptions } from "./action"
import { Result } from "./result"
import { Event } from "./event"
import { Disposable, Removable } from "./common"
import { Emitter, Observable } from "./observable"

/**
 * The kind of command message.
 */
export type CommandKind = "command"

/**
 * A command is a command which triggers an action which can leads to side effects on the system state.
 *
 * @template B the type of the body
 * @template H the type of the headers
 */
export interface Command<B = any, H extends MessageHeaders = MessageHeaders> extends Action<B, H> {
  kind: CommandKind
}

/**
 * The result of a command.
 *
 * @template R the type of the result
 */
export type CommandResult<R extends Result = Result> = ActionResult<R>

/**
 * The synchronous output of a {@link CommandHandler}.
 *
 * @template R the type of the result
 * @template Es the type of the events
 */
export type CommandHandlerOutputSync<R extends Result, Es extends Array<Event> = []> = void | {
  /**
   * An eventual result.
   */
  result?: R
  /**
   * An eventual list of events.
   */
  events?: Es
}

/**
 * The asynchronous output of a {@link CommandHandler}.
 *
 * @template R the type of the result
 * @template Es the type of the events
 */
export type CommandHandlerOutputAsync<R extends Result, Es extends Array<Event> = []> = Promise<
  CommandHandlerOutputSync<R, Es>
>

/**
 * The output of a {@link CommandHandler}.
 *
 * @template R the type of the result
 * @template Es the type of the events
 */
export type CommandHandlerOutput<R extends Result = Result, Es extends Array<Event> = []> =
  | CommandHandlerOutputSync<R, Es>
  | CommandHandlerOutputAsync<R, Es>

/**
 * A command handler handles a {@link Command} and provides eventual {@link CommandHandlerOutput}:
 *
 * - the eventual result to send back
 * - an eventual list of events to publish
 *
 * @template C the type of the command
 * @template R the type of the result
 * @template Es the type of the events
 */
export interface CommandHandler<C extends Command = Command, R extends Result = Result, Es extends Array<Event> = []> {
  /**
   * @param command the command
   */
  (command: C): CommandHandlerOutput<R, Es>
}

/**
 * The symbol used to register {@link CommandBus}.
 */
export const CommandBusSymbol = Symbol.for("ceb/inversion/CommandBus")

/**
 * An event bus is a Point-to-Point Channel transferring {@link Command}.
 */
export interface CommandBus extends Disposable {
  /**
   * Execute a command and wait for a result.
   * @param command the command
   * @param options the options
   * @template R the type of the result
   * @template C the type of the command
   */
  execute<R extends Result = Result, C extends Command = Command>(
    command: C,
    options?: Partial<ExecuteActionOptions>
  ): Promise<CommandResult<R>>

  /**
   * Execute a command but forget the result.
   * @param command the command
   * @template C the type of the command
   */
  executeAndForget<C extends Command = Command>(command: C): void

  /**
   * Register a command handler.
   * @param commandType the type of the command
   * @param handler the handler
   * @template C the type of the command
   * @template R the type of the result
   * @template Es the type of the events
   */
  handle<C extends Command = Command, R extends Result = Result, Es extends Array<Event> = []>(
    commandType: string,
    handler: CommandHandler<C, R, Es>
  ): Removable
}

/**
 * The map defines the internal events of an {@link CommandBus}.
 */
export type CommandBusNotificationMap = {
  command_received: {
    bus: CommandBus
    command: Command
  }
  command_handler_failed: {
    bus: CommandBus
    command: Command
    error: Error
  }
  command_handler_not_found: {
    bus: CommandBus
    command: Command
    error: Error
  }
  disposed: {
    bus: CommandBus
  }
}

/**
 * The observable view of an an {@link CommandBus}.
 */
export interface ObservableCommandBus extends Observable {
  /**
   * Listen to an internal event.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  on<K extends keyof CommandBusNotificationMap>(type: K, listener: (event: CommandBusNotificationMap[K]) => any): this

  /**
   * Remove listeners.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  off<K extends keyof CommandBusNotificationMap>(
    type?: K,
    listener?: (event: CommandBusNotificationMap[K]) => any
  ): this
}

/**
 * The emitter view of an an {@link CommandBus}.
 */
export interface EmittableCommandBus extends Emitter {
  /**
   * Emit an internal event.
   * @param type the type
   * @param event the event
   * @template K the type of the internal event
   */
  emit<K extends keyof CommandBusNotificationMap>(type: K, event: CommandBusNotificationMap[K]): void
}
