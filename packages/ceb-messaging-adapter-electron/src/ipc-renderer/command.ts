import {
  Command,
  CommandBus,
  CommandHandler,
  CommandResult,
  Disposable,
  Event,
  ExecuteActionOptions,
  MessageHeaders,
  Removable,
  Result,
  ResultHeaders,
} from "@tmorin/ceb-messaging-core"
import { IpcRenderer } from "electron"
import { createRemovable, IPC_CHANNEL_COMMANDS } from "../ipc"
import { createIpcListener, executeAction } from "./common"
import { IpcEmitterCommandBus, IpcObservableCommandBus, toError } from "../common"

/**
 * The symbol used to register {@link IpcRendererCommandBus}.
 */
export const IpcRendererCommandBusSymbol = Symbol.for("ceb/inversion/IpcRendererCommandBus")

export class IpcRendererCommandBus implements CommandBus, Disposable {
  constructor(
    private readonly ipcRenderer: IpcRenderer,
    private readonly bus: CommandBus,
    private readonly emitter: IpcEmitterCommandBus
  ) {}

  get observer(): IpcObservableCommandBus {
    return this.emitter
  }

  execute<
    R extends Result<any, ResultHeaders> = Result<any, ResultHeaders>,
    C extends Command<any, MessageHeaders> = Command<any, MessageHeaders>
  >(command: C, options?: Partial<ExecuteActionOptions>): Promise<CommandResult<Result<any, ResultHeaders>>> {
    return executeAction(
      this.ipcRenderer,
      IPC_CHANNEL_COMMANDS,
      () => this.bus.execute<R>(command, options),
      command,
      options
    )
  }

  executeAndForget<C extends Command<any, MessageHeaders> = Command<any, MessageHeaders>>(command: C): void {
    // forward to IPC
    this.ipcRenderer.send(IPC_CHANNEL_COMMANDS, command, { waitForResult: false })
    // forward to parent
    try {
      this.bus.executeAndForget(command)
    } catch (error: any) {
      this.emitter.emit("command_forward_failed", { bus: this, command, error: toError(error) })
    }
  }

  handle<C extends Command = Command, R extends Result = Result, Es extends Array<Event> = []>(
    commandType: string,
    handler: CommandHandler<C, R, Es>
  ): Removable {
    // handle event from parent
    const parentHandler = this.bus.handle(commandType, handler)
    // handle event from IPC
    const ipcListener = createIpcListener<C, R>(
      this.ipcRenderer,
      IPC_CHANNEL_COMMANDS,
      (action, options) => this.bus.execute(action, options),
      (action) => this.bus.executeAndForget(action)
    )
    this.ipcRenderer.on(IPC_CHANNEL_COMMANDS, ipcListener)
    // create the handler
    return createRemovable(() => {
      parentHandler.remove()
      this.ipcRenderer.removeListener(IPC_CHANNEL_COMMANDS, ipcListener)
    })
  }

  async dispose(): Promise<void> {
    await this.bus.dispose()
  }
}
