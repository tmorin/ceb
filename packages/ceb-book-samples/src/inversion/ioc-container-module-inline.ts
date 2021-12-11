import {
  ContainerBuilder,
  OnlyConfigureModule,
} from "@tmorin/ceb-inversion-core"

ContainerBuilder.get()
  .module(
    OnlyConfigureModule.create(async function () {
      // register a name
      this.registry.registerValue("name", "John Doe")
      // register a factory
      this.registry.registerFactory(
        "greeting",
        (registry) => `Hello, ${registry.resolve("name")}!`
      )
    })
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
