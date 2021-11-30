import { Template } from "@tmorin/ceb-templating-builder"
import { html } from "@tmorin/ceb-templating-literal"

const checked = false

const template: Template = html`<input
  required
  disabled=""
  checked="${checked}" />`

template.render(document.body)
