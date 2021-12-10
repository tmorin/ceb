import { ElementBuilder } from "@tmorin/ceb-elements-core"

// defines and register the custom element class
@ElementBuilder.get().decorate()
class SimpleGreeting extends HTMLElement {
  constructor(public name = "World") {
    super()
  }

  connectedCallback() {
    this.textContent = `Hello, ${this.name}!`
  }
}
