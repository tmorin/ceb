import { GatewayEmitter, MessageBuilder } from "@tmorin/ceb-messaging-core"
import {
  SimpleCommandBus,
  SimpleEventBus,
  SimpleGateway,
  SimpleQueryBus,
} from "@tmorin/ceb-messaging-simple"

// create the SimpleGateway dependencies
const emitter = new GatewayEmitter()
const events = new SimpleEventBus(emitter)
const commands = new SimpleCommandBus(events, emitter)
const queries = new SimpleQueryBus(emitter)

// create a SimpleGateway instance
const gateway = new SimpleGateway(events, commands, queries, emitter)

// create an event and publish it
const event = MessageBuilder.event("EventA").build()
gateway.events.publish(event)

// dispose the created SimpleGateway
gateway.dispose().catch((e) => console.error(e))
