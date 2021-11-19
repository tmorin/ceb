import any from "promise.any";
import {IpcMain, IpcMainEvent, webContents} from "electron";
import {
    Bus,
    ExecuteOptions,
    ExecutionHandler,
    Handler,
    MessageAction,
    MessageConstructor,
    MessageEvent,
    MessageKind,
    MessageResult,
    MessageType,
    SubscribeOptions,
    Subscription,
    SubscriptionListener
} from "@tmorin/ceb-messaging-core";
import {IpcActionError, IpcBusEventMap, IpcHandler, IpcMessageMetadata, IpcSubscription} from "./bus";
import {IpcMessageConverter, SimpleIpcMessageConverter} from "./converter";

/**
 * The symbol used to register {@link IpcMainBus}.
 */
export const IpcMainBusSymbol = Symbol.for("ceb/inversion/IpcMainBus")

/**
 * The implementation of {@link Bus} for the Main context of Electron IPC.
 */
export class IpcMainBus implements Bus {
    constructor(
        private readonly parentBus: Bus,
        private readonly ipcMain: IpcMain,
        private readonly ipcMessageConverter: IpcMessageConverter = new SimpleIpcMessageConverter()
    ) {
    }

    emit<K extends keyof IpcBusEventMap>(type: K, event: IpcBusEventMap[K]): void {
        // @ts-ignore
        this.parentBus.emit.apply(this.parentBus, Array.from(arguments))
    }

    on<K extends keyof IpcBusEventMap>(type: K, listener: (event: IpcBusEventMap[K]) => any): this {
        // @ts-ignore
        this.parentBus.on.apply(this.parentBus, Array.from(arguments))
        return this
    }

    off<K extends keyof IpcBusEventMap>(type?: K, listener?: (event: IpcBusEventMap[K]) => any): this {
        // @ts-ignore
        this.parentBus.off.apply(this.parentBus, Array.from(arguments))
        return this
    }

    async dispose() {
        await this.parentBus.dispose()
    }

    handle<M extends MessageAction, R extends MessageResult>(
        ActionType: MessageType | MessageConstructor<M>,
        ResultType: MessageType | MessageConstructor<R>,
        handler: ExecutionHandler<M, R>
    ): Handler {
        // handle event from parent
        const parentHandler = this.parentBus.handle(ActionType, ResultType, handler)
        // handle event from IPC
        const channel: string = typeof ActionType === "string"
            ? ActionType
            : ActionType["MESSAGE_TYPE"] || ActionType.prototype["MESSAGE_TYPE"] || ActionType.name
        const ipcListener = async (event: IpcMainEvent, data: any, metadata: IpcMessageMetadata) => {
            const message = this.ipcMessageConverter.deserialize<M>(ActionType, {channel, data, metadata})
            if (metadata.waitForResult) {
                try {
                    const result = await this.parentBus.execute(message, ResultType, {
                        timeout: metadata.timeout
                    })
                    const ipcResult = this.ipcMessageConverter.serialize(result)
                    event.reply(channel, ipcResult.data, {
                        ...ipcResult.metadata,
                        correlationId: message.headers.messageId
                    })
                } catch (error: any) {
                    const ipcError = this.ipcMessageConverter.serialize(new IpcActionError(message, error))
                    event.reply(channel, ipcError.data, {
                        ...ipcError.metadata,
                        correlationId: message.headers.messageId
                    })
                }
            } else {
                this.parentBus.execute(message)
            }
        }
        this.ipcMain.on(channel, ipcListener)
        // create the handler
        return new IpcHandler(() => {
            parentHandler.cancel()
            this.ipcMain.removeListener(channel, ipcListener)
        })
    }

    publish<E extends MessageEvent>(event: E): void {
        // forward to IPC
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(event)
        webContents.getAllWebContents().forEach(webContent => webContent.send(channel, data, metadata))
        // forward to parent
        try {
            this.parentBus.publish(event)
        } catch (error: any) {
            this.emit("event_forward_failed", {bus: this, event, error})
        }
    }

    subscribe<E extends MessageEvent>(
        EventType: MessageType | MessageConstructor<E>,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription {
        // handle event from parent
        const parentSubscription = this.parentBus.subscribe(EventType, listener, options)
        // handle event from IPC
        const channel: string = typeof EventType === "string"
            ? EventType
            : EventType["MESSAGE_TYPE"] || EventType.prototype["MESSAGE_TYPE"] || EventType.name
        const ipcListener = (event: IpcMainEvent, data: any, metadata: IpcMessageMetadata) => {
            const message = this.ipcMessageConverter.deserialize<E>(EventType, {
                channel: channel,
                data,
                metadata
            })
            this.parentBus.publish(message)
        }
        this.ipcMain.on(channel, ipcListener)
        // create the subscription
        return new IpcSubscription(() => {
            parentSubscription.unsubscribe()
            this.ipcMain.removeListener(channel, ipcListener)
        })
    }

    execute<A extends MessageAction>(action: A, arg1?: any, arg2?: any): any {
        if (arg1) {
            return this.executeAndWait(action, arg1, arg2)
        }
        this.executeAndForget(action)
    }

    private async executeAndWait<A extends MessageAction, R extends MessageResult>(
        action: A,
        ResultType: MessageType | MessageConstructor<R>,
        options?: ExecuteOptions
    ): Promise<R> {
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(action)
        // forward to IPC
        const pIpc = new Promise<R>((resolve, reject) => {
            const listener = (event: IpcMainEvent, data: any, metadata: IpcMessageMetadata) => {
                // leave early if the message type is wrong
                if (action.headers.messageId === metadata.correlationId) {
                    clearTimeout(timeoutId);
                    const message = this.ipcMessageConverter.deserialize(ResultType, {channel, data, metadata})
                    if (message.kind === MessageKind.error) {
                        reject(message.body);
                    } else {
                        resolve(message);
                    }
                }
            }

            const timeout = options?.timeout || 500
            const timeoutId = setTimeout(() => {
                this.ipcMain.removeListener(channel, listener)
                reject(new Error(`IpcRendererBus - unable to get a result after ${timeout} ms`))
            }, timeout)

            this.ipcMain.once(channel, listener)

            webContents.getAllWebContents().forEach(webContent => webContent.send(channel, data, {
                ...metadata,
                waitForResult: true
            }))
        })
        // forward to parent
        let pParent
        try {
            pParent = this.parentBus.execute(action, ResultType, options)
        } catch (e) {
            pParent = Promise.reject(e)
        }
        // return first
        return any<R>([pParent, pIpc])
    }

    private executeAndForget<A extends MessageAction>(action: A): void {
        // forward to IPC
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(action)
        webContents.getAllWebContents().forEach(webContent => webContent.send(channel, data, {
            ...metadata,
            waitForResult: false
        }))
        // forward to parent
        try {
            this.parentBus.execute(action)
        } catch (error: any) {
            this.emit("action_forward_failed", {bus: this, action, error})
        }
    }

}
