import { AbstractModule } from "@tmorin/ceb-inversion-core"
import { GreetSomebodyHandler } from "./inversion-discovery-command"
import { WhatTimeIsItHandler } from "./inversion-discovery-query"
import { SOMEONE_HAS_BEEN_GREETED_LISTENER } from "./inversion-discovery-event"
import {
  DiscoverableCommandHandlerSymbol,
  DiscoverableEventListenerSymbol,
  DiscoverableQueryHandlerSymbol,
} from "@tmorin/ceb-messaging-inversion"

// define a "regular" Module
export class DiscoverableStuffModule extends AbstractModule {
  async configure() {
    // register the command handler
    this.registry.registerValue(
      DiscoverableCommandHandlerSymbol,
      new GreetSomebodyHandler()
    )
    // register the query handler
    this.registry.registerFactory(
      DiscoverableQueryHandlerSymbol,
      () => new WhatTimeIsItHandler()
    )
    // register the event listener
    this.registry.registerValue(
      DiscoverableEventListenerSymbol,
      SOMEONE_HAS_BEEN_GREETED_LISTENER
    )
  }
}
