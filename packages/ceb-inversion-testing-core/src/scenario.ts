import {Container, ContainerBuilder} from "@tmorin/ceb-inversion";
import {CallbackWithContainer, CallbackWithContainerBuilder} from "./common";

/**
 * A scenario is a set of steps which are executed one by one in order to validate a business behavior.
 *
 * The steps are:
 *
 * 1. {@link TestScenario.configure}: configure the container, optional
 * 2. {@link TestScenario.before}: prepare the test, optional
 * 3. {@link TestScenario.execute}: execute the test
 * 4. {@link TestScenario.after}: cleanup the test, optional
 */
export interface TestScenario {

    /**
     * The name of the scenario.
     */
    readonly name: string

    /**
     * The method has to be used to configure the container of the execution.
     * @param containerBuilder the builder of container
     */
    configure?(containerBuilder: ContainerBuilder): any

    /**
     * The method has to be used to prepare the scenario execution.
     * @param container the container
     */
    before?(container: Container): any

    /**
     * The method has to be used to perform actions and validates the side effects.
     * @param container the container
     */
    execute(container: Container): any

    /**
     * The method has to be used to cleanup resources
     * @param container the container
     */
    after?(container: Container): any

}

/**
 * The builder helps the creation of {@link TestScenario}.
 */
export class TestScenarioBuilder {

    private constructor(
        private readonly _name: string,
        private _configure?: CallbackWithContainerBuilder,
        private _before?: CallbackWithContainer,
        private _execute: CallbackWithContainer = () => {
        },
        private _after?: CallbackWithContainer,
    ) {
    }

    /**
     * Get a new builder.
     * @param name the name of the scenario
     */
    static get(name: string) {
        return new TestScenarioBuilder(name)
    }

    /**
     * Define the {@link TestScenario.configure} method.
     * @param cb the callback
     */
    configure(cb: CallbackWithContainerBuilder) {
        this._configure = cb
        return this
    }

    /**
     * Define the {@link TestScenario.before} method.
     * @param cb the callback
     */
    before(cb: CallbackWithContainer) {
        this._before = cb
        return this
    }

    /**
     * Define the {@link TestScenario.execute} method.
     * @param cb the callback
     */
    execute(cb: CallbackWithContainer) {
        this._execute = cb
        return this
    }

    /**
     * Define the {@link TestScenario.after} method.
     * @param cb the callback
     */
    after(cb: CallbackWithContainer) {
        this._after = cb
        return this
    }

    /**
     * Build the scenario and return it.
     */
    build(): TestScenario {
        return {
            name: this._name,
            configure: this._configure,
            before: this._before,
            execute: this._execute,
            after: this._after,
        }
    }
}
