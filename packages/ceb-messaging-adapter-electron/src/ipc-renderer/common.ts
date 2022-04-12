import { Action, ActionResult, ExecuteActionOptions, Result } from "@tmorin/ceb-messaging-core"
import { IpcRenderer, IpcRendererEvent } from "electron"
import any from "promise.any"
import { createErrorResult, IPC_CHANNEL_COMMANDS, IpcMessageMetadata } from "../ipc"

export function executeAction<R extends Result = Result, A extends Action = Action>(
  ipcRenderer: IpcRenderer,
  channel: string,
  executeLocally: () => Promise<ActionResult<R>>,
  action: A,
  options?: Partial<ExecuteActionOptions>
): Promise<Result> {
  // forward to IPC
  const pIpc = new Promise<ActionResult<R>>((resolve, reject) => {
    const listener = (event: IpcRendererEvent, data: R, metadata: IpcMessageMetadata) => {
      // leave early if the message type is wrong
      if (action.headers.messageId === metadata.correlationId) {
        clearTimeout(timeoutId)
        if (data.headers.messageType === createErrorResult.MESSAGE_TYPE) {
          reject(data.body)
        } else {
          resolve(data)
        }
      }
    }

    const timeout = options?.timeout || 500
    const timeoutId = setTimeout(() => {
      ipcRenderer.removeListener(channel, listener)
      reject(new Error(`IpcAdapter - unable to get a result after ${timeout} ms`))
    }, timeout)

    ipcRenderer.once(channel, listener)

    ipcRenderer.send(channel, action, { waitForResult: true })
  })
  // forward to parent
  let pParent: Promise<ActionResult<R>>
  try {
    pParent = executeLocally()
  } catch (e) {
    pParent = Promise.reject(e)
  }
  // return first
  return any([pParent, pIpc])
}

export function createIpcListener<A extends Action = Action, R extends Result = Result>(
  ipcRenderer: IpcRenderer,
  channel: string,
  executeLocally: (action: A, options: Partial<ExecuteActionOptions>) => Promise<ActionResult<R>>,
  executeLocallyAndForget: (action: A) => any
): (event: IpcRendererEvent, ...args: any[]) => void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (event: IpcRendererEvent, action: A, metadata: IpcMessageMetadata) => {
    if (metadata.waitForResult) {
      executeLocally(action, {
        timeout: metadata.timeout,
      })
        .then((result) =>
          ipcRenderer.send(IPC_CHANNEL_COMMANDS, result, {
            correlationId: action.headers.messageId,
          })
        )
        .catch((error) =>
          ipcRenderer.send(IPC_CHANNEL_COMMANDS, createErrorResult(action, error), {
            correlationId: action.headers.messageId,
          })
        )
    } else {
      executeLocallyAndForget(action)
    }
  }
}
