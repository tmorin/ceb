import { FieldListenerData } from "@tmorin/ceb-elements-builders"
import { ElementBuilder } from "@tmorin/ceb-elements-core"
import {
  ContentBuilder,
  FieldBuilder,
  ReferenceBuilder,
} from "@tmorin/ceb-elements-builders"

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
export class ExGreeting extends HTMLElement {
  @FieldBuilder.get().decorate()
  name: string = "World"

  @ReferenceBuilder.get().shadow().selector("span#name").decorate()
  span?: HTMLSpanElement

  @FieldBuilder.get().decorate()
  private onName(data: FieldListenerData<string>) {
    if (this.span) {
      this.span.textContent = data.newVal
    }
  }
}
