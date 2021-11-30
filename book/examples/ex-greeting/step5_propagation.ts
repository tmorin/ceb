import {
  AttributePropagationBuilder,
  ContentBuilder,
  FieldBuilder,
} from "@tmorin/ceb-elements-builders"
import { ElementBuilder } from "@tmorin/ceb-elements-core"

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
@AttributePropagationBuilder.get("name")
  .shadow()
  .to("span#name")
  .property("textContent")
  .decorate()
export class ExGreeting extends HTMLElement {
  @FieldBuilder.get().decorate()
  name: string = "World"
}
