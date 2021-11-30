import { assert } from "chai"
import { toCamelCase, toKebabCase } from "./index"

describe("utilities", () => {
  it("should convert to camel case", () => {
    assert.strictEqual(toCamelCase("to-camel-case"), "toCamelCase")
  })
  it("should convert to kebab case", () => {
    assert.strictEqual(toKebabCase("ToCamelCase"), "to-camel-case")
  })
  it("should handle empty string", () => {
    assert.strictEqual(toCamelCase(""), "")
    assert.strictEqual(toKebabCase(""), "")
  })
})
