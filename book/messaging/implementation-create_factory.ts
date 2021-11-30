import { Gateway, MessageBuilder } from "@tmorin/ceb-messaging-core"
import { SimpleGateway } from "@tmorin/ceb-messaging-simple"

// create a SimpleGateway instance
const gateway: Gateway = SimpleGateway.create()

// create an event and publish it
const event = MessageBuilder.event("EventA").build()
gateway.events.publish(event)

// dispose the created SimpleGateway
gateway.dispose().catch((e) => console.error(e))
