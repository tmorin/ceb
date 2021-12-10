import { AbstractModule } from "@tmorin/ceb-inversion-core"

export class WorldModule extends AbstractModule {
  async configure(): Promise<void> {
    // register a name
    this.registry.registerValue("name", "World")
  }
}

export class GreetingModule extends AbstractModule {
  async configure(): Promise<void> {
    // register a factory
    this.registry.registerFactory(
      "greeting",
      (registry) => `Hello, ${registry.resolve("name")}!`
    )
  }
}
