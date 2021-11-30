import { MessageBuilder } from "@tmorin/ceb-messaging-core"

// create an event
const anEventA = MessageBuilder.event("EventA")
  // set a custom identifier
  .identifier("event-1")
  // add an header entry
  .headers({ k1: "v1" })
  // set a body
  .body("a body")
  // build the result
  .build()
