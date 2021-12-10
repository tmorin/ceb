import { ContainerBuilder } from "@tmorin/ceb-inversion-core"
import {
  Gateway,
  GatewaySymbol,
  MessageBuilder,
} from "@tmorin/ceb-messaging-core"
import { SimpleModule } from "@tmorin/ceb-messaging-simple-inversion"

ContainerBuilder.get()
  // let the module created it-self the SimpleGateway instance
  .module(new SimpleModule())
  .build()
  .initialize()
  .then((container) => {
    // resolve the gateway
    const gateway = container.registry.resolve<Gateway>(GatewaySymbol)
    // publish a simple message
    gateway.events.publish(MessageBuilder.event("Hello").build())
  })
  .catch((e) => console.error(e))
