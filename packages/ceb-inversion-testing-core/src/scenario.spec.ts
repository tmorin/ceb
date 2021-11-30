import assert from "assert"
import { spy } from "sinon"
import { TestScenarioBuilder } from "./scenario"

describe("inversion/testing/core/scenario", function () {
  const spyConfigure = spy()
  const spyBefore = spy()
  const spyExecute = spy()
  const spyAfter = spy()
  it("should create a test scenario", function () {
    const scenario = TestScenarioBuilder.get("a scenario")
      .configure(spyConfigure)
      .before(spyBefore)
      .execute(spyExecute)
      .after(spyAfter)
      .build()
    assert.strictEqual(scenario.name, "a scenario")
    assert.strictEqual(scenario.configure, spyConfigure)
    assert.strictEqual(scenario.before, spyBefore)
    assert.strictEqual(scenario.execute, spyExecute)
    assert.strictEqual(scenario.after, spyAfter)
  })
})
