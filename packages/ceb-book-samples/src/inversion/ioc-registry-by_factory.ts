import { DefaultRegistry } from "@tmorin/ceb-inversion-core"

// create a fresh registry
const registry = new DefaultRegistry()

// register a Factory
registry.registerFactory("key", () => ({ k: "v" }))

// resolve the entry
const a = registry.resolve("key")

// resolve again the entry
const b = registry.resolve("key")

// assert instances are not the same
console.assert(a !== b)
