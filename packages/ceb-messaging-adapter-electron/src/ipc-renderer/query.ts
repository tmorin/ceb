import {
    ExecuteActionOptions,
    MessageHeaders,
    Query,
    QueryBus,
    QueryHandler,
    QueryResult,
    Removable,
    Result,
    ResultHeaders,
} from "@tmorin/ceb-messaging-core"
import {IpcRenderer} from "electron"
import {createRemovable, IPC_CHANNEL_QUERIES} from "../ipc"
import {createIpcListener, executeAction} from "./common"
import {IpcEmitterQueryBus, IpcObservableQueryBus} from "../common"

/**
 * The symbol used to register {@link IpcRendererQueryBus}.
 */
export const IpcRendererQueryBusSymbol = Symbol.for("ceb/inversion/IpcRendererQueryBus")

export class IpcRendererQueryBus implements QueryBus {
  constructor(
    private readonly ipcRenderer: IpcRenderer,
    private readonly bus: QueryBus,
    private readonly emitter: IpcEmitterQueryBus
  ) {}

  get observer(): IpcObservableQueryBus {
    return this.emitter
  }

  execute<
    R extends Result<any, ResultHeaders> = Result<any, ResultHeaders>,
    Q extends Query<any, MessageHeaders> = Query<any, MessageHeaders>
  >(query: Q, options?: Partial<ExecuteActionOptions>): Promise<QueryResult<R>> {
    return executeAction(
      this.ipcRenderer,
      IPC_CHANNEL_QUERIES,
      () => this.bus.execute<R>(query, options),
      query,
      options
    )
  }

  handle<
    Q extends Query<any, MessageHeaders> = Query<any, MessageHeaders>,
    R extends Result<any, ResultHeaders> = Result<any, ResultHeaders>
  >(queryType: string, handler: QueryHandler<Q, R>): Removable {
    // handle event from parent
    const handlerRemover = this.bus.handle(queryType, handler)
    // handle event from IPC
    const ipcListener = createIpcListener<Q, R>(
      this.ipcRenderer,
      IPC_CHANNEL_QUERIES,
      (action, options) => this.bus.execute(action, options),
      () => {
        throw new Error(`IpcAdapter - a query cannot be executed without an expected result`)
      }
    )
    this.ipcRenderer.on(IPC_CHANNEL_QUERIES, ipcListener)
    // create the handler
    return createRemovable(() => {
      handlerRemover.remove()
      this.ipcRenderer.removeListener(IPC_CHANNEL_QUERIES, ipcListener)
    })
  }

  async dispose(): Promise<void> {
    await this.bus.dispose()
  }
}
