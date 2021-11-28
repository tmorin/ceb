import {Event, EventBus, EventListener, MessageHeaders, Removable, SubscribeOptions} from "@tmorin/ceb-messaging-core"
import {IpcMain, IpcMainEvent, webContents} from "electron";
import {createRemovable, IPC_CHANNEL_EVENTS, IpcMessageMetadata} from "../ipc";
import {IpcEmitterEventBus, IpcObservableEventBus} from "../common";

/**
 * The symbol used to register {@link IpcMainEventBus}.
 */
export const IpcMainEventBusSymbol = Symbol.for("ceb/inversion/IpcMainEventBus")

export class IpcMainEventBus implements EventBus {

    constructor(
        private readonly ipcMain: IpcMain,
        private readonly bus: EventBus,
        private readonly emitter: IpcEmitterEventBus,
    ) {
    }

    get observer(): IpcObservableEventBus {
        return this.emitter
    }

    publish<E extends Event<any, MessageHeaders> = Event<any, MessageHeaders>>(
        ...events: E[]
    ): void {
        events.forEach(event => {
            // forward to IPC
            webContents.getAllWebContents().forEach(webContent => webContent.send(IPC_CHANNEL_EVENTS, event, {}));
            // forward to parent
            try {
                this.bus.publish(event)
            } catch (error: any) {
                this.emitter.emit("event_forward_failed", {bus: this, event, error})
            }
        })
    }

    subscribe<E extends Event<any, MessageHeaders> = Event<any, MessageHeaders>>(
        eventType: string, listener: EventListener<E>, options?: Partial<SubscribeOptions>
    ): Removable {
        // handle event from parent
        const localSubscription = this.bus.subscribe(eventType, listener, options)
        // handle event from IPC
        const ipcListener = (event: IpcMainEvent, data: E, _: IpcMessageMetadata) => {
            // forward to parent
            try {
                this.bus.publish(data)
            } catch (error: any) {
                this.emitter.emit("event_forward_failed", {bus: this, event: data, error})
            }

        }
        this.ipcMain.on(IPC_CHANNEL_EVENTS, ipcListener)
        // create the subscription
        return createRemovable(() => {
            localSubscription.remove()
            this.ipcMain.removeListener(IPC_CHANNEL_EVENTS, ipcListener)
        })
    }

    async dispose(): Promise<void> {
        await this.bus.dispose()
    }

}
