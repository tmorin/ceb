import {
  ContainerBuilder,
  OnlyConfigureModule,
} from "@tmorin/ceb-inversion-core"
import {
  Gateway,
  GatewaySymbol,
  MessageBuilder,
} from "@tmorin/ceb-messaging-core"
import {
  MoleculerModule,
  ServiceBrokerSymbol,
} from "@tmorin/ceb-messaging-moleculer-inversion"
import { ServiceBroker } from "moleculer"

ContainerBuilder.get()
  // create a service broker
  .module(
    OnlyConfigureModule.create(async function () {
      this.registry.registerFactory<ServiceBroker>(
        ServiceBrokerSymbol,
        () => new ServiceBroker()
      )
    })
  )
  // register the module which build the Moleculer Gateway
  .module(new MoleculerModule())
  .build()
  .initialize()
  .then((container) => {
    // resolve the gateway
    const gateway = container.registry.resolve<Gateway>(GatewaySymbol)
    // publish a moleculer message
    gateway.events.publish(MessageBuilder.event("Hello").build())
  })
  .catch((e) => console.error(e))
