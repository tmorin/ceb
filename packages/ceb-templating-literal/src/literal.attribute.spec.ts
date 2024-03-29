import { assert, expect } from "chai"
import { html } from "./literal"

describe("literal/attribute", function () {
  let el: HTMLDivElement
  beforeEach(() => {
    if (el) {
      el.parentNode?.removeChild(el)
    }
    el = document.body.appendChild(document.createElement("div"))
  })
  it("should parse attributes", function () {
    const value = 1
    const template = html`<p>
      <input name="name" required disabled="" type="number" data-name="a name" value="${value}" />
    </p>`
    template.render(el)
    assert.ok(el.querySelector("p"))
    assert.equal(
      el.querySelector("p")?.innerHTML?.trim(),
      `<input name="name" required="" disabled="" type="number" data-name="a name" value="1">`
    )
  })
  it("should parse complex attributes", function () {
    const foo = "foo"
    const bar = "bar"
    const template = html`<p><input type="text" name="${foo}" value="before ${bar} after" /></p>`
    template.render(el)
    expect(el.innerHTML).to.be.eq(`<p><input type="text" name="foo" value="before bar after"></p>`)
  })
})
