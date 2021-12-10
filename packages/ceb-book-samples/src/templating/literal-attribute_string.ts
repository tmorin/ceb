import { Template } from "@tmorin/ceb-templating-builder"
import { html } from "@tmorin/ceb-templating-literal"

const foo = "bar"

const template: Template = html`<input class="${foo}" />`

template.render(document.body)
