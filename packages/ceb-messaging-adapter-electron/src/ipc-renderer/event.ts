import {Event, EventBus, EventListener, MessageHeaders, Removable, SubscribeOptions} from "@tmorin/ceb-messaging-core"
import {IpcRenderer, IpcRendererEvent} from "electron"
import {createRemovable, IPC_CHANNEL_EVENTS, IpcMessageMetadata} from "../ipc"
import {IpcEmitterEventBus, IpcObservableEventBus} from "../common"

/**
 * The symbol used to register {@link IpcRendererEventBus}.
 */
export const IpcRendererEventBusSymbol = Symbol.for("ceb/inversion/IpcRendererEventBus")

export class IpcRendererEventBus implements EventBus {

    constructor(
        private readonly ipcRenderer: IpcRenderer,
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
            this.ipcRenderer.send(IPC_CHANNEL_EVENTS, event, {})
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
        const ipcListener = (event: IpcRendererEvent, data: E, _: IpcMessageMetadata) => {
            try {
                this.bus.publish(data)
            } catch (error: any) {
                this.emitter.emit("event_forward_failed", {bus: this, event: data, error})
            }
        }
        this.ipcRenderer.on(IPC_CHANNEL_EVENTS, ipcListener)
        // create the subscription
        return createRemovable(() => {
            localSubscription.remove()
            this.ipcRenderer.removeListener(IPC_CHANNEL_EVENTS, ipcListener)
        })
    }

    async dispose(): Promise<void> {
        await this.bus.dispose()
    }

}
