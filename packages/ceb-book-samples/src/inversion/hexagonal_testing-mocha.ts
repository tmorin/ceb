import { MochaTestSuiteExecutorBuilder } from "@tmorin/ceb-inversion-testing-mocha"
import { SuiteA } from "./hexagonal_testing-suite"
import { ModuleBuilder } from "@tmorin/ceb-inversion-core"

describe("ToEmphasize Adapter", function () {
  MochaTestSuiteExecutorBuilder.get(SuiteA)
    .configure((containerBuilder) => {
      containerBuilder.module(
        ModuleBuilder.get()
          .configure((registry) => {
            registry.registerValue("ToEmphasize", (value: string) =>
              value.toUpperCase()
            )
          })
          .build()
      )
    })
    .build()
    .execute()
})
