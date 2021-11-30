import { ContainerBuilder } from "@tmorin/ceb-inversion-core"
import {
  Gateway,
  GatewaySymbol,
  MessageBuilder,
} from "@tmorin/ceb-messaging-core"
import { SimpleGateway, SimpleModule } from "@tmorin/ceb-messaging-simple"

ContainerBuilder.get()
  .module(
    new SimpleModule({
      // the provided instance, there the GLOBAL one
      gateway: SimpleGateway.GLOBAL,
    })
  )
  .build()
  .initialize()
  .then((container) => {
    // resolve the gateway
    const gateway = container.registry.resolve<Gateway>(GatewaySymbol)
    // publish a simple message
    gateway.events.publish(MessageBuilder.event("Hello").build())
  })
  .catch((e) => console.error(e))
