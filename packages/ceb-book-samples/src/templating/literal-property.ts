import { Template } from "@tmorin/ceb-templating-builder"
import { html } from "@tmorin/ceb-templating-literal"

const value = "Foo"

const template: Template = html`<input p:bar="${value}" />`

template.render(document.body)
