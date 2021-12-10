import { Template } from "@tmorin/ceb-templating-builder"
import { html } from "@tmorin/ceb-templating-literal"

const name = "World"

const template: Template = html`<p>Hello, ${name}!</p>`

template.render(document.body)
