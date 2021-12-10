import { ContainerBuilder } from "@tmorin/ceb-inversion-core"
import { GreetingModule, WorldModule } from "./ioc-container-module-class"

ContainerBuilder.get()
  .module(new GreetingModule())
  .module(new WorldModule())
  .build()
  .initialize()
  .then((container) => {
    // resolve the greeting entry
    const greeting = container.registry.resolve("greeting")
    // assert the greeting text match the expected one
    console.assert(greeting === "Hello, World!")
    // release the stateful stuff
    return container.dispose()
  })
  .catch((e) => console.error(e))
