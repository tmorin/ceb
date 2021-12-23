import { ContainerBuilder, ModuleBuilder } from "@tmorin/ceb-inversion-core"
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
    ModuleBuilder.get()
      .configure(function (registry) {
        registry.registerFactory<ServiceBroker>(
          ServiceBrokerSymbol,
          () => new ServiceBroker()
        )
      })
      .build()
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
