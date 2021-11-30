import {EitherAsync, Maybe} from "purify-ts"
import {
    Command,
    CommandBus,
    Event,
    ExecuteActionOptions,
    MessageBuilder,
    Removable,
    Result,
    ResultHeaders,
} from "@tmorin/ceb-messaging-core"

/**
 * The asynchronous result of a command.
 */
export type PurifyCommandResultAsync<B = any> = EitherAsync<Error, Maybe<B>>

/**
 * The output of a command handler.
 */
export type PurifyCommandHandlerOutput<B = any, Es extends Array<Event> = []> = {
  result: Maybe<B>
  events: Maybe<Es>
}

/**
 * The asynchronous output of a command handler.
 */
export type PurifyCommandHandlerOutputAsync<B = any, Es extends Array<Event> = []> = EitherAsync<
  Error,
  PurifyCommandHandlerOutput<B, Es>
>

/**
 * A command handler.
 */
export interface PurifyCommandHandler<C extends Command = Command, B = any, Es extends Array<Event> = []> {
  /**
   * @param command the command
   */
  (command: C): PurifyCommandHandlerOutputAsync<B, Es>
}

/**
 * Helper to create {@link PurifyCommandHandlerOutput}
 * @param data the data
 */
export function createPurifyCommandHandlerOutput<B = any, Es extends Array<Event> = []>(
  data: Partial<PurifyCommandHandlerOutput<B, Es>> = {}
): PurifyCommandHandlerOutput<B, Es> {
  return {
    result: Maybe.zero(),
    events: Maybe.zero(),
    ...data,
  }
}

/**
 * The symbol used to register {@link PurifyCommandBus}.
 */
export const PurifyCommandBusSymbol = Symbol.for("ceb/inversion/PurifyCommandBus")

/**
 * An adapter of {@link CommandBus} for the purify world.
 */
export class PurifyCommandBus {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Execute a command.
   * @param command the command
   * @param options the options
   */
  execute<B = any, C extends Command = Command, R extends Result<B> = Result>(
    command: C,
    options?: Partial<ExecuteActionOptions>
  ): PurifyCommandResultAsync<B> {
    return EitherAsync<Error, Maybe<B>>(() =>
      this.commandBus
        .execute<R, C>(command, options)
        .then((result) => result.body)
        .then((body) => Maybe.fromNullable(body))
        .then((maybe) => maybe)
    )
  }

  /**
   * Execute a command but doesn't wait for its result.
   * @param command the command
   */
  executeAndForget<C extends Command = Command>(command: C): void {
    this.commandBus.executeAndForget(command)
  }

  /**
   * Handle a command.
   * @param commandType the type of the command
   * @param handler the handler
   */
  handle<C extends Command = Command, B = any, Es extends Array<Event> = [], R extends Result<B> = Result>(
    commandType: string,
    handler: PurifyCommandHandler<C, B, Es>
  ): Removable {
    return this.commandBus.handle<C, R, Es>(commandType, (command) => {
      return handler(command)
        .map((output) => {
          const result = output.result
            .map((body) => MessageBuilder.result<B, ResultHeaders, R>(command).body(body).build())
            .extract()
          const events = output.events.extract()
          return {
            result,
            events,
          }
        })
        .run()
        .then((either) => {
          if (either.isLeft()) {
            const error = either.swap().extract()
            throw error
          } else if (either.isRight()) {
            const result = either.extract()
            return result
          }
        })
    })
  }
}
