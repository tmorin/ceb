import assert from "assert"
import { spy } from "sinon"
import { TestScenarioBuilder } from "./scenario"
import { TestSuiteBuilder } from "./suite"

describe("inversion/testing/core/suite", function () {
  const spyConfigure = spy()
  const spyBefore = spy()
  const spyExecute = spy()
  const spyAfter = spy()
  it("should create a test suite", function () {
    const scenario = TestScenarioBuilder.get("a scenario")
      .configure(spyConfigure)
      .before(spyBefore)
      .execute(spyExecute)
      .after(spyAfter)
      .build()
    const suite = TestSuiteBuilder.get("a suite").scenario(scenario).build()
    assert.strictEqual(suite.name, "a suite")
    assert.strictEqual(scenario.configure, spyConfigure)
  })
})
