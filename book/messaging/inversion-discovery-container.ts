import { ContainerBuilder } from "@tmorin/ceb-inversion-core"
import {
  Gateway,
  GatewaySymbol,
  MessageBuilder,
  MessagingModule,
} from "@tmorin/ceb-messaging-core"
import { SimpleModule } from "@tmorin/ceb-messaging-simple"
import { DiscoverableStuffModule } from "./inversion-discovery-module"

ContainerBuilder.get()
  // register the module which discovers the handlers and listeners
  .module(new MessagingModule())
  // register the module which provide a Gateway instance
  .module(new SimpleModule())
  // register the module which contain the discoverable handlers and listeners
  .module(new DiscoverableStuffModule())
  .build()
  .initialize()
  .then(async (container) => {
    // resolve the gateway
    const gateway = container.registry.resolve<Gateway>(GatewaySymbol)

    // register an event listener
    gateway.events.subscribe("SomeoneHasBeenGreeted", (event) => {
      console.info(`${event.body} has been greeted`)
    })

    // create and execute the GreetSomebody command
    const greetSomebody = MessageBuilder.command("GreetSomebody")
      .body("World")
      .build()
    const cmdResult = await gateway.commands.execute(greetSomebody)
    console.info(`the greeting text: ${cmdResult.body}`)

    // create and execute the WhatTimeIsIt query
    const whatTimeIsIt = MessageBuilder.query("WhatTimeIsIt")
      .body("World")
      .build()
    const qryResult = await gateway.queries.execute(whatTimeIsIt)
    console.info(`the time: ${qryResult.body}`)

    return container.dispose()
  })
  .catch((e) => console.error(e))
