import { ContainerBuilder, ModuleBuilder } from "@tmorin/ceb-inversion-core"

ContainerBuilder.get()
  .module(
    ModuleBuilder.get()
      .configure(function (registry) {
        // register a name
        registry.registerValue("name", "John Doe")
        // register a factory
        registry.registerFactory(
          "greeting",
          (registry) => `Hello, ${registry.resolve("name")}!`
        )
      })
      .build()
  )
  .build()
  .initialize()
  .then((container) => {
    // resolve the greeting entry
    const greeting = container.registry.resolve("greeting")
    // assert the greeting text match the expected one
    console.assert(greeting === "Hello, John Doe!")
    // release the stateful stuff
    return container.dispose()
  })
  .catch((e) => console.error(e))
