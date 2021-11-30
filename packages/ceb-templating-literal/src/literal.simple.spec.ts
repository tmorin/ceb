import { expect } from "chai"
import { html } from "./literal"

describe("literal/simple", function () {
  let el: HTMLDivElement
  beforeEach(() => {
    if (el) {
      el.parentNode?.removeChild(el)
    }
    el = document.body.appendChild(document.createElement("div"))
  })
  it("should parse elements", function () {
    const template = html`<p>a text<input /><!--a comment--></p>`
    template.render(el)
    expect(el.innerHTML).to.be.eq("<p>a text<input><!--a comment--></p>")
  })
  it("should parse text node", function () {
    const name = "world"
    const template = html`<p>hello ${name}</p>`
    template.render(el)
    expect(el.innerHTML).to.be.eq(`<p>hello world</p>`)
  })
  it("should handle undefined values", function () {
    const name = undefined
    const template = html`<p>hello ${name}</p>`
    template.render(el)
    expect(el.innerHTML).to.be.eq(`<p>hello </p>`)
  })
  it("should handle null values", function () {
    const name = null
    const template = html`<p>hello ${name}</p>`
    template.render(el)
    expect(el.innerHTML).to.be.eq(`<p>hello </p>`)
  })
  it("should handle value first", function () {
    const before = "before"
    const after = "after"
    const template = html`${before} A ${after} B`
    template.render(el)
    expect(el.innerHTML).to.be.eq(`before A after B`)
  })
})
