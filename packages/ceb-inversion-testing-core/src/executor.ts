import {Callback, CallbackWithContainerBuilder, ContainerBuilderProvider} from "./common"
import {TestSuite} from "./suite"
import {ContainerBuilder} from "@tmorin/ceb-inversion-core"

/**
 * An executor of test suite.
 */
export interface TestSuiteExecutor<O = any> {
  /**
   * The test suite.
   */
  readonly suite: TestSuite

  /**
   * Execute the test suite.
   */
  execute(): O
}

/**
 * An abstract class helping to implement a {@link TestSuiteExecutor}.
 *
 * The abstraction expects the following execution steps:
 *
 * 1. {@link AbstractTestSuiteExecutor.before}: prepare the test suite, optional
 * 2. {@link AbstractTestSuiteExecutor.provider} : provide the {@link ContainerBuilder}, optional
 * 3. {@link AbstractTestSuiteExecutor.configure} : configure the {@link Container}, optional
 * 4. {@link AbstractTestSuiteExecutor.execute}: execute the test suite
 * 5. {@link AbstractTestSuiteExecutor.after}: cleanup the test suite, optional
 */
export abstract class AbstractTestSuiteExecutor<O = any> implements TestSuiteExecutor<O> {
  protected constructor(
    readonly suite: TestSuite,
    protected before?: Callback,
    protected provide: ContainerBuilderProvider = () => ContainerBuilder.get(),
    protected configure?: CallbackWithContainerBuilder,
    protected after?: Callback
  ) {}

  /**
   * Execute the test suite.
   */
  abstract execute(): O
}

/**
 * An abstract class helping to implement builder of {@link TestSuiteExecutor} based on {@link AbstractTestSuiteExecutor}.
 */
export abstract class AbstractTestSuiteExecutorBuilder<O = any> {
  protected constructor(
    protected _suite: TestSuite,
    protected _provider?: ContainerBuilderProvider,
    protected _configurer?: CallbackWithContainerBuilder,
    protected _before?: Callback,
    protected _after?: Callback
  ) {}

  /**
   * Define the before method.
   * @param cb the callback
   */
  before(cb: Callback) {
    this._before = cb
    return this
  }

  /**
   * Define the provider of {@link ContainerBuilder}.
   * @param provider the provider
   */
  provide(provider: ContainerBuilderProvider) {
    this._provider = provider
    return this
  }

  /**
   * Define the configurer of {@link Container}
   * @param cb the callback
   */
  configure(cb: CallbackWithContainerBuilder) {
    this._configurer = cb
    return this
  }

  /**
   * Define the after method.
   * @param cb the callback
   */
  after(cb: Callback) {
    this._after = cb
    return this
  }

  /**
   * Build a {@link TestSuiteExecutor}.
   */
  abstract build(): TestSuiteExecutor<O>

  /**
   * Build and then execute the {@link TestSuiteExecutor}.
   */
  test(): O {
    return this.build().execute()
  }
}
