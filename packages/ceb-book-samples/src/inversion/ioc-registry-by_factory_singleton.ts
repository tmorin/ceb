import { DefaultRegistry } from "@tmorin/ceb-inversion-core"

// create a fresh registry
const registry = new DefaultRegistry()

// register a Factory acting as a singleton
registry.registerFactory("key", () => ({ k: "v" }), { singleton: true })

// resolve the entry
const a = registry.resolve("key")

// resolve again the entry
const b = registry.resolve("key")

// assert instances are the same
console.assert(a === b)
