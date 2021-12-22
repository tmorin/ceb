import {
  Command,
  CommandBus,
  CommandBusNotificationMap,
  CommandHandler,
  CommandHandlerOutputSync,
  CommandResult,
  EmittableCommandBus,
  Event,
  EventBus,
  MessageBuilder,
  ObservableCommandBus,
  Removable,
  Result,
} from "@tmorin/ceb-messaging-core"
import { Context, Service, ServiceBroker } from "moleculer"
import { MoleculerExecuteActionOptions } from "./common"

/**
 * The map of the internal events for commands handling.
 */
export interface MoleculerCommandBusNotificationMap extends CommandBusNotificationMap {
  moleculer_service_destruction_failed: {
    name: string
    bus: CommandBus
    error: Error
  }
  command_execution_failed: {
    command: Command
    bus: CommandBus
    error: Error
  }
}

export interface MoleculerObservableCommandBus extends ObservableCommandBus {
  /**
   * Listen to an internal event.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  on<K extends keyof MoleculerCommandBusNotificationMap>(
    type: K,
    listener: (event: MoleculerCommandBusNotificationMap[K]) => any
  ): this

  /**
   * Remove listeners.
   * @param type the type of the event
   * @param listener the listener
   * @template K the type of the internal event
   */
  off<K extends keyof MoleculerCommandBusNotificationMap>(
    type?: K,
    listener?: (event: MoleculerCommandBusNotificationMap[K]) => any
  ): this
}

/**
 * The emitter view of an an {@link CommandBus}.
 */
export interface MoleculerEmitterCommandBus extends EmittableCommandBus {
  /**
   * Emit an internal event.
   * @param type the type
   * @param event the event
   * @template K the type of the internal event
   */
  emit<K extends keyof MoleculerCommandBusNotificationMap>(type: K, event: MoleculerCommandBusNotificationMap[K]): void
}

/**
 * Implementation of the {@link CommandBus} for Moleculer.
 */
export class MoleculerCommandBus implements CommandBus {
  constructor(
    private readonly eventBus: EventBus,
    private readonly emitter: MoleculerEmitterCommandBus,
    private readonly broker: ServiceBroker,
    private readonly services: Set<Service> = new Set()
  ) {}

  get observer(): MoleculerObservableCommandBus {
    return this.emitter
  }

  private static publishEvents<R extends Result, Es extends Array<Event> = []>(
    eventBus: EventBus,
    output: CommandHandlerOutputSync<R, Es>
  ): CommandResult<R> | void {
    if (output) {
      output.events?.forEach((event) => eventBus.publish(event))
      return output.result
    }
  }

  private static createService<C extends Command = Command, R extends Result = Result, Es extends Array<Event> = []>(
    commandType: string,
    handler: CommandHandler<C, R, Es>,
    broker: ServiceBroker,
    commandBus: CommandBus,
    eventBus: EventBus,
    emitter: MoleculerEmitterCommandBus
  ): Service {
    return broker.createService({
      name: commandType,
      actions: {
        execute(context: Context): Promise<R> {
          const command = context.params as C
          // @ts-ignore
          return Promise.resolve<CommandHandlerOutputSync<R, Es>>((async () => handler(command))())
            .then((output) => MoleculerCommandBus.publishEvents<R, Es>(eventBus, output))
            .then((result) => result || MessageBuilder.result(command).type("empty").build())
            .catch((error: Error) => {
              emitter.emit("command_handler_failed", {
                bus: commandBus,
                command,
                error,
              })
              throw error
            })
        },
        executeAndForget(context: Context): void {
          const command = context.params as C
          Promise.resolve<CommandHandlerOutputSync<R, Es>>((async () => handler(command))())
            .then((output) => MoleculerCommandBus.publishEvents<R, Es>(eventBus, output))
            .then((result) => result || MessageBuilder.result(command).type("empty").build())
            .catch((error: Error) => {
              emitter.emit("command_handler_failed", {
                bus: commandBus,
                command,
                error,
              })
            })
        },
      },
    })
  }

  handle<C extends Command = Command, R extends Result = Result, Es extends Array<Event> = []>(
    commandType: string,
    handler: CommandHandler<C, R, Es>
  ): Removable {
    if (this.broker.services.find((s) => s.name === commandType)) {
      throw new Error(`the command type ${commandType} is already handled`)
    }

    const service = MoleculerCommandBus.createService(
      commandType,
      handler,
      this.broker,
      this,
      this.eventBus,
      this.emitter
    )

    this.services.add(service)

    return {
      remove: () => {
        this.services.delete(service)
        this.broker.destroyService(service).catch((error: Error) =>
          this.emitter.emit("moleculer_service_destruction_failed", {
            bus: this,
            error,
            name: service.name,
          })
        )
      },
    }
  }

  execute<R extends Result = Result, C extends Command = Command>(
    command: C,
    options?: Partial<MoleculerExecuteActionOptions>
  ): Promise<R> {
    const commandName = `${command.headers.messageType}.execute`
    return this.broker.call<R, C>(commandName, command, {
      ...options,
      requestID: command.headers.messageId,
    })
  }

  executeAndForget<C extends Command = Command>(command: C): void {
    const commandName = `${command.headers.messageType}.executeAndForget`
    this.broker
      .call<unknown, C>(commandName, command, {
        requestID: command.headers.messageId,
      })
      .catch((error: Error) => {
        this.emitter.emit("command_execution_failed", {
          bus: this,
          command,
          error,
        })
      })
  }

  async dispose(): Promise<void> {
    await Promise.all(
      Array.from(this.services).map((service) => {
        this.broker.destroyService(service).catch((error: Error) =>
          this.emitter.emit("moleculer_service_destruction_failed", {
            bus: this,
            error,
            name: service.name,
          })
        )
      })
    )
  }
}
