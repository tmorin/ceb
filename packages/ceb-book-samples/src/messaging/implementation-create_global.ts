import { MessageBuilder } from "@tmorin/ceb-messaging-core"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"

// create an event and publish it using the global SimpleGateway instance
const event = MessageBuilder.event("EventA").build()
SimpleGateway.GLOBAL.events.publish(event)
