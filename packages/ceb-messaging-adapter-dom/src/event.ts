import { Component } from "@tmorin/ceb-inversion-core"
import { EventBusNotificationMap, Gateway } from "@tmorin/ceb-messaging-core"
import { DomEvent } from "./message"

/**
 * The component implements a Bridge to forward event messages between a {@link Gateway} and a DOM {@link EventTarget} object.
 * The bridge translates {@link Event} to {@link DomEvent} and vice versa.
 */
export class EventBridge implements Component {
  private domListener?: EventListener
  private gatewayListener?: (data: EventBusNotificationMap["event_received"]) => any

  constructor(readonly target: EventTarget = window, readonly gateway: Gateway) {}

  async configure(): Promise<void> {
    this.domListener = (event: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (event instanceof DomEvent && event.detail.headers.domBridgeOrigin !== "gateway") {
        this.gateway.events.publish(event.detail)
      }
    }
    this.target.addEventListener(DomEvent.CUSTOM_EVENT_TYPE, this.domListener)

    this.gatewayListener = (data) => {
      const newEvent = {
        ...data.event,
        headers: {
          ...data.event.headers,
          domBridgeOrigin: "gateway",
        },
      }
      this.target.dispatchEvent(new DomEvent(newEvent))
    }
    this.gateway.observer.on("event_received", this.gatewayListener)
  }

  async dispose(): Promise<void> {
    if (this.domListener) {
      this.target.removeEventListener(DomEvent.CUSTOM_EVENT_TYPE, this.domListener)
    }
    if (this.gatewayListener) {
      this.gateway.observer.off("event_received", this.gatewayListener)
    }
  }
}
