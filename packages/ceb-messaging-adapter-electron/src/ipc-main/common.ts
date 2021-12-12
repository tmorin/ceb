import { IpcMain, IpcMainEvent, webContents } from "electron"
import any from "promise.any"
import { Action, ExecuteActionOptions, Result } from "@tmorin/ceb-messaging-core"
import { createErrorResult, IpcMessageMetadata } from "../ipc"

export function executeAction<R extends Result = Result, A extends Action = Action>(
  ipcMain: IpcMain,
  channel: string,
  executeLocally: () => Promise<R>,
  action: A,
  options?: Partial<ExecuteActionOptions>
): Promise<Result> {
  // forward to IPC
  const pIpc = new Promise<R>((resolve, reject) => {
    const listener = (event: IpcMainEvent, data: R, metadata: IpcMessageMetadata) => {
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
      ipcMain.removeListener(channel, listener)
      reject(new Error(`IpcAdapter - unable to get a result after ${timeout} ms`))
    }, timeout)

    ipcMain.once(channel, listener)

    webContents.getAllWebContents().forEach((webContent) => webContent.send(channel, action, { waitForResult: true }))
  })
  // forward to parent
  let pParent: Promise<R>
  try {
    pParent = executeLocally()
  } catch (e) {
    pParent = Promise.reject(e)
  }
  // return first
  return any([pParent, pIpc])
}

export function createIpcListener<A extends Action = Action, R extends Result = Result>(
  channel: string,
  executeLocally: (action: A, options: Partial<ExecuteActionOptions>) => Promise<R>,
  executeLocallyAndForget: (action: A) => any
): (event: IpcMainEvent, ...args: any[]) => void {
  return async (event: IpcMainEvent, action: A, metadata: IpcMessageMetadata) => {
    if (metadata.waitForResult) {
      try {
        const result = await executeLocally(action, {
          timeout: metadata.timeout,
        })
        event.reply(channel, result, { correlationId: action.headers.messageId })
      } catch (error: any) {
        event.reply(channel, createErrorResult(action, error), { correlationId: action.headers.messageId })
      }
    } else {
      executeLocallyAndForget(action)
    }
  }
}
