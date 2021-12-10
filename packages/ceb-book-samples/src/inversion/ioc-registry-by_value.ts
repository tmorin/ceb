import { DefaultRegistry } from "@tmorin/ceb-inversion-core"

// create a fresh registry
const registry = new DefaultRegistry()

// register a Value
registry.registerValue("key", "the value")

// resolve the entry
const a = registry.resolve("key")

// resolve again the entry
const b = registry.resolve("key")

// assert instances are the same
console.assert(a === b)
