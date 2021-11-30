import {TestScenario, TestScenarioBuilder} from "./scenario"

/**
 * A suite is a set of {@link TestScenario}.
 */
export interface TestSuite {
  /**
   * The name of the suite.
   */
  readonly name: string

  /**
   * The set of scenarios.
   */
  readonly scenarios: Array<TestScenario>
}

/**
 * The builder helps the creation of {@link TestSuite}.

 */
export class TestSuiteBuilder {
  private constructor(private readonly _name: string, private readonly _scenarios: Array<TestScenario> = []) {}

  /**
   * Get a new builder.
   * @param name the name of the suite
   */
  static get(name: string) {
    return new TestSuiteBuilder(name)
  }

  /**
   * Add a scenario.
   * @param scenario the scenario
   */
  scenario(scenario: TestScenario | TestScenarioBuilder) {
    if (scenario instanceof TestScenarioBuilder) {
      this._scenarios.push(scenario.build())
    } else {
      this._scenarios.push(scenario)
    }
    return this
  }

  /**
   * Build the suite and return it.
   */
  build(): TestSuite {
    return {
      name: this._name,
      scenarios: this._scenarios,
    }
  }
}
