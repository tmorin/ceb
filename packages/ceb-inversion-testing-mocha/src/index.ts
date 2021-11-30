import {Suite} from "mocha"
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
import {Container, ContainerBuilder} from "@tmorin/ceb-inversion-core"

/**
 * An implementation of {@link AbstractTestSuiteExecutor} dedicated for Mocha.
 *
 * Instances should be created using the builder {@link MochaTestSuiteExecutorBuilder}.
 */
export class MochaTestSuiteExecutor extends AbstractTestSuiteExecutor<Suite> {
  constructor(
    suite: TestSuite,
    before?: Callback,
    provider?: ContainerBuilderProvider,
    configurer?: CallbackWithContainerBuilder,
    after?: Callback
  ) {
    super(suite, before, provider, configurer, after)
  }

  execute(): Suite {
    return describe(this.suite.name, () => {
      for (const scenario of this.suite.scenarios) {
        describe(scenario.name, () => {
          let containerBuilder: ContainerBuilder
          let container: Container
          before("before scenario", async () => {
            if (this.before) {
              await this.before()
            }
          })
          before("create the container builder", async () => {
            containerBuilder = this.provide()
          })
          before("configure the builder with executor configuration", async () => {
            if (this.configure) {
              await Promise.resolve(this.configure(containerBuilder))
            }
          })
          before("configure the builder with scenario configuration", async () => {
            if (scenario.configure) {
              await Promise.resolve(scenario.configure(containerBuilder))
            }
          })
          before("initialize the container", async () => {
            container = await containerBuilder.build().initialize()
          })
          before("before execution", async () => {
            if (scenario.before) {
              await scenario.before(container)
            }
          })
          it("execution", async () => {
            await scenario.execute(container)
          })
          after("after execution", async () => {
            if (scenario.after) {
              await scenario.after(container)
            }
          })
          after("dispose the container", async () => {
            await container.dispose()
          })
          after("after scenario", async () => {
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
 * An extension of {@link AbstractTestSuiteExecutorBuilder} dedicated for Mocha.
 *
 * @example run a test suite with an dummy scenario
 * ```typescript
 * import {TestScenarioBuilder, TestSuiteBuilder} from "@tmorin/ceb-inversion-testing-core";
 * import {MochaTestSuiteExecutor} from "@tmorin/ceb-inversion-testing-mocha"
 * MochaTestSuiteExecutorBuilder.get(
 *  TestSuiteBuilder.get("test suite").scenario(
 *      TestScenarioBuilder.get("test scenario")
 *  )
 * ).test()
 * ```
 */
export class MochaTestSuiteExecutorBuilder extends AbstractTestSuiteExecutorBuilder<Suite> {
  protected constructor(suite: TestSuite) {
    super(suite)
  }

  /**
   * Create a builder.
   * @param suite the suite
   */
  static get(suite: TestSuite | TestSuiteBuilder) {
    if (suite instanceof TestSuiteBuilder) {
      return new MochaTestSuiteExecutorBuilder(suite.build())
    }
    return new MochaTestSuiteExecutorBuilder(suite)
  }

  /**
   * Build the executor.
   */
  build(): TestSuiteExecutor<Suite> {
    return new MochaTestSuiteExecutor(this._suite, this._before, this._provider, this._configurer, this._after)
  }
}
