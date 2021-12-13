import { JestTestSuiteExecutorBuilder } from "@tmorin/ceb-inversion-testing-jest"
import { OnlyConfigureModule } from "@tmorin/ceb-inversion-core"
import { SuiteA } from "./hexagonal_testing-suite"

describe("ToEmphasize Adapter", function () {
  JestTestSuiteExecutorBuilder.get(SuiteA)
    .configure((containerBuilder) => {
      containerBuilder.module(
        OnlyConfigureModule.create(async function () {
          this.registry.registerValue("ToEmphasize", (value: string) =>
            value.toUpperCase()
          )
        })
      )
    })
    .build()
    .execute()
})
