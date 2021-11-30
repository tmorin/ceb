import { DiscoverableEventListener, Event } from "@tmorin/ceb-messaging-core"

// create the listener using the "object" way
export const SOMEONE_HAS_BEEN_GREETED_LISTENER: DiscoverableEventListener<
  Event<string>
> = {
  // the type of the Event to handle
  type: "SomeoneHasBeenGreeted",
  // the handler
  listener: (event: Event<string>) => {
    console.info(`${event.body} has been greeted`)
  },
}
