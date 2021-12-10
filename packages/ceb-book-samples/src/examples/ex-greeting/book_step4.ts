import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { ContentBuilder, FieldBuilder } from "@tmorin/ceb-elements-builders"

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
export class ExGreeting extends HTMLElement {
  @FieldBuilder.get().decorate()
  name: string = "World"
}
