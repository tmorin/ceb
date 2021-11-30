import { SinonSpy, spy } from "sinon"
import { TestScenarioBuilder, TestSuiteBuilder } from "@tmorin/ceb-inversion-testing-core"
import { MochaTestSuiteExecutorBuilder } from "./index"
import assert from "assert"

describe("inversion/testing/mocha", function () {
  const spyList = new Set<SinonSpy>()
  const createSyp = () => {
    const aSpy: SinonSpy = spy()
    spyList.add(aSpy)
    return aSpy
  }

  const scenario = TestScenarioBuilder.get("test scenario")
    .configure(createSyp())
    .before(createSyp())
    .execute(createSyp())
    .after(createSyp())
    .build()

  const suite = TestSuiteBuilder.get("test suite").scenario(scenario).build()

  MochaTestSuiteExecutorBuilder.get(suite)
    .before(createSyp())
    .configure(createSyp())
    .after(createSyp())
    .test()
    .afterAll(() => {
      for (const aSpy of spyList) {
        assert.ok(aSpy)
      }
    })
})
