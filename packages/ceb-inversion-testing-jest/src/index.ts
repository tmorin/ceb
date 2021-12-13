import {
  AbstractTestSuiteExecutor,
  AbstractTestSuiteExecutorBuilder,
  Callback,
  CallbackWithContainerBuilder,
  ContainerBuilderProvider,
  TestSuite,
  TestSuiteBuilder,
  TestSuiteExecutor,
} from "@tmorin/ceb-inversion-testing-core"
import { Container, ContainerBuilder } from "@tmorin/ceb-inversion-core"

/**
 * An implementation of {@link AbstractTestSuiteExecutor} dedicated for Jest.
 *
 * Instances should be created using the builder {@link JestTestSuiteExecutorBuilder}.
 */
export class JestTestSuiteExecutor extends AbstractTestSuiteExecutor<void> {
  constructor(
    suite: TestSuite,
    before?: Callback,
    provider?: ContainerBuilderProvider,
    configurer?: CallbackWithContainerBuilder,
    after?: Callback
  ) {
    super(suite, before, provider, configurer, after)
  }

  execute() {
    describe(this.suite.name, () => {
      for (const scenario of this.suite.scenarios) {
        describe(scenario.name, () => {
          let containerBuilder: ContainerBuilder
          let container: Container
          beforeEach(async () => {
            // before scenario
            if (this.before) {
              await this.before()
            }
            // create the container builder
            containerBuilder = this.provide()
            // configure the builder with executor configuration
            if (this.configure) {
              await Promise.resolve(this.configure(containerBuilder))
            }
            // configure the builder with scenario configuration
            if (scenario.configure) {
              await Promise.resolve(scenario.configure(containerBuilder))
            }
            // initialize the container
            container = await containerBuilder.build().initialize()
            // before execution
            if (scenario.before) {
              await scenario.before(container)
            }
          })
          test("execution", async () => {
            await scenario.execute(container)
          })
          afterEach(async () => {
            // after execution
            if (scenario.after) {
              await scenario.after(container)
            }
          })
          afterEach(async () => {
            // dispose the container
            if (container) {
              await container.dispose()
            }
          })
          afterEach(async () => {
            // after scenario
            if (this.after) {
              await this.after()
            }
          })
        })
      }
    })
  }
}

/**
 * An extension of {@link AbstractTestSuiteExecutorBuilder} dedicated for Jest.
 *
 * @example run a test suite with an dummy scenario
 * ```typescript
 * import {TestScenarioBuilder, TestSuiteBuilder} from "@tmorin/ceb-inversion-testing-core";
 * import {JestTestSuiteExecutor} from "@tmorin/ceb-inversion-testing-jest"
 * JestTestSuiteExecutorBuilder.get(
 *  TestSuiteBuilder.get("test suite").scenario(
 *      TestScenarioBuilder.get("test scenario")
 *  )
 * ).test()
 * ```
 */
export class JestTestSuiteExecutorBuilder extends AbstractTestSuiteExecutorBuilder<void> {
  protected constructor(suite: TestSuite) {
    super(suite)
  }

  /**
   * Create a builder.
   * @param suite the suite
   */
  static get(suite: TestSuite | TestSuiteBuilder) {
    if (suite instanceof TestSuiteBuilder) {
      return new JestTestSuiteExecutorBuilder(suite.build())
    }
    return new JestTestSuiteExecutorBuilder(suite)
  }

  /**
   * Build the executor.
   */
  build(): TestSuiteExecutor<void> {
    return new JestTestSuiteExecutor(this._suite, this._before, this._provider, this._configurer, this._after)
  }
}
