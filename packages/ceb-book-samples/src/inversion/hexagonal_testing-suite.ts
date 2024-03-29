import { assert } from "chai"
import { ModuleBuilder } from "@tmorin/ceb-inversion-core"
import {
  TestScenarioBuilder,
  TestSuiteBuilder,
} from "@tmorin/ceb-inversion-testing-core"

export const SuiteA = TestSuiteBuilder.get("ToEmphasize Port")
  .scenario(
    TestScenarioBuilder.get("Greeting target is emphasized")
      .configure((containerBuilder) => {
        containerBuilder.module(
          ModuleBuilder.get()
            .configure(function (registry) {
              registry.registerFactory("Greeting", (registry) => {
                // expect an adapter of the port "ToEmphasize"
                const toEmphasize =
                  registry.resolve<(value: string) => string>("ToEmphasize")
                // use the adapter to emphasize the target name
                return `Hello, ${toEmphasize("john doe")}`
              })
            })
            .build()
        )
      })
      .execute((container) => {
        // resolve the model artifact
        const text = container.registry.resolve<string>("Greeting")
        // validate the model artifact works as expected with the tested adapter
        assert.equal(text, "Hello, JOHN DOE!")
      })
      .build()
  )
  .build()
