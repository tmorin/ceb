import { Template } from "@tmorin/ceb-templating-builder"
import { html } from "@tmorin/ceb-templating-literal"

const template: Template = html`<div><ul o:skip></ul></div>`

template.render(document.body)
