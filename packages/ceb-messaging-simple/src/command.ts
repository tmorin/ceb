import {
  Command,
  CommandBus,
  CommandHandler,
  CommandHandlerOutputSync,
  CommandResult,
  Disposable,
  EmittableCommandBus,
  Event,
  EventBus,
  ExecuteActionOptions,
  MessageBuilder,
  ObservableCommandBus,
  Removable,
  Result,
} from "@tmorin/ceb-messaging-core"
import { waitForReturn } from "./common"

/**
 * The symbol used to register {@link SimpleCommandBus}.
 */
export const SimpleCommandBusSymbol = Symbol.for("ceb/inversion/SimpleCommandBus")

export class SimpleCommandBus implements CommandBus, Disposable {
  constructor(
    private readonly eventBus: EventBus,
    private readonly emitter: EmittableCommandBus,
    private readonly handlers = new Map<string, CommandHandler<any, any, any>>()
  ) {}

  get observe(): ObservableCommandBus {
    return this.emitter
  }

  async execute<R extends Result = Result, C extends Command = Command>(
    command: C,
    options?: Partial<ExecuteActionOptions>
  ): Promise<R> {
    this.emitter.emit("command_received", {
      bus: this,
      command,
    })

    const handler = this.resolveHandler(command)

    const opts: ExecuteActionOptions = {
      timeout: 500,
      ...options,
    }

    const result = await waitForReturn(async () => await handler(command), opts.timeout)
      .then((output) => this.processHandlerOutput(output))
      .catch((error: Error) => {
        this.emitter.emit("command_handler_failed", {
          bus: this,
          command,
          error,
        })
        throw error
      })

    // @ts-ignore
    return result || MessageBuilder.result(command).type("empty").build()
  }

  executeAndForget<C extends Command = Command>(command: C): void {
    this.emitter.emit("command_received", {
      bus: this,
      command,
    })

    const handler = this.resolveHandler(command)
    Promise.resolve((async () => handler(command))())
      .then((output) => this.processHandlerOutput(output))
      .catch((error: Error) => {
        this.emitter.emit("command_handler_failed", {
          bus: this,
          command,
          error,
        })
      })
  }

  handle<C extends Command = Command, R extends Result = Result, Es extends Array<Event> = []>(
    commandType: string,
    handler: CommandHandler<C, R, Es>
  ): Removable {
    if (this.handlers.has(commandType)) {
      throw new Error(`the command type ${commandType} is already handled`)
    }
    this.handlers.set(commandType, handler)
    return {
      remove: () => {
        this.handlers.delete(commandType)
      },
    }
  }

  async dispose(): Promise<void> {
    this.handlers.clear()
    this.emitter.emit("disposed", { bus: this })
  }

  private resolveHandler<C extends Command = Command, R extends Result = Result, Es extends Array<Event> = []>(
    command: Command
  ): CommandHandler<C, R, Es> {
    const handler = this.handlers.get(command.headers.messageType)
    if (handler) {
      return handler
    }
    const error = new Error(`handler not found for ${command.headers.messageType}`)
    this.emitter.emit("command_handler_not_found", {
      bus: this,
      command,
      error,
    })
    throw error
  }

  private processHandlerOutput<R extends Result>(output: CommandHandlerOutputSync<R>): CommandResult<R> | void {
    if (output) {
      output.events?.forEach((event) => this.eventBus.publish(event))
      return output.result
    }
  }
}
