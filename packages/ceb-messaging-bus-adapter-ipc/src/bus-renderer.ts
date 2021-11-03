import any from "promise.any";
import {IpcRenderer, IpcRendererEvent} from "electron";
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
import {IpcHandler, IpcMessageConverter, IpcActionError, IpcMessageMetadata, IpcSubscription} from "./bus";
import {BusEventListener} from "@tmorin/ceb-messaging-core/src";

/**
 * The implementation of {@link Bus} for the Renderer contexts of Electron IPC.
 */
export class IpcRendererBus implements Bus {
    constructor(
        private readonly parentBus: Bus,
        private readonly ipcMessageConverter: IpcMessageConverter,
        private readonly ipcRenderer: IpcRenderer,
    ) {
    }

    emit(event: string | symbol, ...args: any[]): void {
        // @ts-ignore
        this.parentBus.emit.apply(this.parentBus, Array.from(arguments))
    }

    on(event: string | symbol, listener: BusEventListener): this {
        // @ts-ignore
        this.parentBus.on.apply(this.parentBus, Array.from(arguments))
        return this
    }

    off(event?: string | symbol, listener?: BusEventListener): this {
        // @ts-ignore
        this.parentBus.off.apply(this.parentBus, Array.from(arguments))
        return this
    }

    async dispose() {
        await this.parentBus.dispose()
    }

    async execute<A extends MessageAction>(action: A, arg1?: any, arg2?: any): Promise<any> {
        if (arg1) {
            return this.executeAndWait(action, arg1, arg2)
        }
        return this.executeAndForget(action)
    }

    handle<M extends MessageAction, R extends MessageResult>(
        actionType: MessageType,
        ResultType: MessageConstructor<R>,
        handler: ExecutionHandler<M, R>
    ): Handler {
        // handle event from parent
        const parentHandler = this.parentBus.handle(actionType, ResultType, handler)
        // handle event from IPC
        const channel: string = actionType
        const ipcListener = async (event: IpcRendererEvent, data: any, metadata: IpcMessageMetadata) => {
            const message = this.ipcMessageConverter.deserialize<M>(channel, {channel, data, metadata})
            if (metadata.waitForResult) {
                try {
                    const result = await this.parentBus.execute(message, ResultType, {
                        timeout: metadata.timeout
                    })
                    const ipcResult = this.ipcMessageConverter.serialize(result)
                    this.ipcRenderer.send(channel, ipcResult.data, {
                        ...ipcResult.metadata,
                        correlationId: message.headers.messageId
                    })
                } catch (error: any) {
                    const ipcError = this.ipcMessageConverter.serialize(new IpcActionError(message, error))
                    this.ipcRenderer.send(channel, ipcError.data, {
                        ...ipcError.metadata,
                        correlationId: message.headers.messageId
                    })
                }
            } else {
                this.parentBus.execute(message)
                    .catch(error => this.emit("error", error))
            }
        }
        this.ipcRenderer.on(channel, ipcListener)
        // create the handler
        return new IpcHandler(() => {
            parentHandler.cancel()
            this.ipcRenderer.removeListener(channel, ipcListener)
        })
    }

    async publish<E extends MessageEvent>(event: E): Promise<void> {
        // forward to IPC
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(event)
        this.ipcRenderer.send(channel, data, metadata)
        // forward to parent
        return this.parentBus.publish(event)
    }

    subscribe<E extends MessageEvent>(
        eventType: MessageType,
        listener: SubscriptionListener<E>,
        options?: SubscribeOptions
    ): Subscription {
        // handle event from IPC
        const channel = eventType
        const ipcListener = (event: IpcRendererEvent, data: any, metadata: IpcMessageMetadata) => {
            const message = this.ipcMessageConverter.deserialize<E>(eventType, {channel, data, metadata})
            this.parentBus.publish(message)
        }
        this.ipcRenderer.on(channel, ipcListener)
        // handle event from parent
        const parentSubscription = this.parentBus.subscribe(eventType, listener, options)
        // create the subscription
        return new IpcSubscription(() => {
            parentSubscription.unsubscribe()
            this.ipcRenderer.removeListener(channel, ipcListener)
        })
    }

    private async executeAndWait<A extends MessageAction, R extends MessageResult>(
        action: A,
        ResultType: MessageConstructor<R>,
        options?: ExecuteOptions
    ): Promise<R> {
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(action)
        // forward to IPC
        const pIpc = new Promise<R>((resolve, reject) => {
            const listener = (event: IpcRendererEvent, data: any, metadata: IpcMessageMetadata) => {
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
                this.ipcRenderer.removeListener(channel, listener)
                reject(new Error(`IpcRendererBus - unable to get a result after ${timeout} ms`))
            }, timeout)

            this.ipcRenderer.once(channel, listener)

            this.ipcRenderer.send(channel, data, {...metadata, waitForResult: true})
        })
        // forward to parent
        const pParent = this.parentBus.execute(action, ResultType, options)
        // return first
        return any<R>([pParent, pIpc])
    }

    private async executeAndForget<A extends MessageAction>(action: A): Promise<void> {
        // forward to IPC
        const {channel, data, metadata} = this.ipcMessageConverter.serialize(action)
        this.ipcRenderer.send(channel, data, {...metadata, waitForResult: false})
        // forward to parent
        return this.parentBus.execute(action)
            .catch(error => this.emit("error", error))
    }
}
