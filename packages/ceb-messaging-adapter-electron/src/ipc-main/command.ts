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
import {IpcMain, webContents} from "electron"
import {createRemovable, IPC_CHANNEL_COMMANDS} from "../ipc"
import {createIpcListener, executeAction} from "./common"
import {IpcEmitterCommandBus, IpcObservableCommandBus} from "../common"

/**
 * The symbol used to register {@link IpcMainCommandBus}.
 */
export const IpcMainCommandBusSymbol = Symbol.for("ceb/inversion/IpcMainCommandBus")

export class IpcMainCommandBus implements CommandBus, Disposable {
  constructor(
    private readonly ipcMain: IpcMain,
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
      this.ipcMain,
      IPC_CHANNEL_COMMANDS,
      () => this.bus.execute<R>(command, options),
      command,
      options
    )
  }

  executeAndForget<C extends Command<any, MessageHeaders> = Command<any, MessageHeaders>>(command: C): void {
    // forward to IPC
    webContents
      .getAllWebContents()
      .forEach((webContent) => webContent.send(IPC_CHANNEL_COMMANDS, command, { waitForResult: false }))
    // forward to parent
    try {
      this.bus.executeAndForget(command)
    } catch (error: any) {
      this.emitter.emit("command_forward_failed", { bus: this, command, error })
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
      IPC_CHANNEL_COMMANDS,
      (action, options) => this.bus.execute(action, options),
      (action) => this.bus.executeAndForget(action)
    )
    this.ipcMain.on(IPC_CHANNEL_COMMANDS, ipcListener)
    // create the handler
    return createRemovable(() => {
      parentHandler.remove()
      this.ipcMain.removeListener(IPC_CHANNEL_COMMANDS, ipcListener)
    })
  }

  async dispose(): Promise<void> {
    await this.bus.dispose()
  }
}
