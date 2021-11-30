import { ContainerBuilder } from "@tmorin/ceb-inversion-core"

ContainerBuilder.get()
  .build() // from `void` to `Built`
  .initialize() // from `Built` to `Alive`
  .then((container) => {
    return container.dispose() // from `Alive` to `Disposed`
  })
