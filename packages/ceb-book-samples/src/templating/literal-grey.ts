import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { Template, TemplateBuilder } from "@tmorin/ceb-templating-builder"
import { html } from "@tmorin/ceb-templating-literal"

class HelloWorld extends HTMLElement {
  render(): Template {
    return html`<p>Hello, <ceb-slot></ceb-slot>!</p>`
  }
}

ElementBuilder.get().builder(TemplateBuilder.get().grey()).register()
