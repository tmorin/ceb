import { Command, CommandHandler, Event, Result } from "@tmorin/ceb-messaging-core"

/**
 * The symbol used to register {@link DiscoverableCommandHandler}.
 */
export const DiscoverableCommandHandlerSymbol = Symbol.for("ceb/inversion/DiscoverableCommandHandler")

/**
 * A command handler discovered by the container on startup.
 *
 * @template C the type of the Command
 * @template R the type of the Result
 * @template Es the type of the Events
 */
export type DiscoverableCommandHandler<
  C extends Command = Command,
  R extends Result = Result,
  Es extends Array<Event> = []
> = {
  type: string
  handler: CommandHandler<C, R, Es>
}
