import { ElementBuilder } from "@tmorin/ceb-elements-core"

// defines and register the custom element class
@ElementBuilder.get().extends("p").decorate()
class SimpleGreetingParagraph extends HTMLParagraphElement {
  constructor(public name = "World") {
    super()
  }

  connectedCallback() {
    this.textContent = `Hello, ${this.name}!`
  }
}
