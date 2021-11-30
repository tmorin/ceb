import { Template } from "@tmorin/ceb-templating-builder"
import { html } from "@tmorin/ceb-templating-literal"

const lis = ["item A", "item B"].map(
  (item) => html`<li o:key="${item}">${item}</li>`
)

const template: Template = html`<div>
  <ul>
    ${lis}
  </ul>
</div>`

template.render(document.body)
