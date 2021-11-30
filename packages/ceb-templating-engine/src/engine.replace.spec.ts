import { expect } from "chai"
import { Engine } from "./engine"

describe("engine/replace", () => {
  let el: HTMLDivElement
  beforeEach(() => {
    if (el) {
      el.parentNode?.removeChild(el)
    }
    el = document.body.appendChild(document.createElement("div"))
  })
  it("should replace a comment by a text", () => {
    el.innerHTML = ""
    Engine.update(el, (engine) => {
      engine.comment("a comment")
    })
    expect(el.innerHTML).to.be.eq("<!--a comment-->")
    Engine.update(el, (engine) => {
      engine.text("a text")
    })
    expect(el.innerHTML).to.be.eq("a text")
  })
  it("should replace a `p` by an `input`", () => {
    el.innerHTML = ""
    Engine.update(el, (engine) => {
      engine.openElement("p")
      engine.closeElement()
    })
    expect(el.innerHTML).to.be.eq("<p></p>")
    Engine.update(el, (engine) => {
      engine.voidElement("input")
    })
    expect(el.innerHTML).to.be.eq("<input>")
  })
  it("should replace a text by an `input`", () => {
    el.innerHTML = ""
    Engine.update(el, (engine) => {
      engine.text("a text")
    })
    expect(el.innerHTML).to.be.eq("a text")
    Engine.update(el, (engine) => {
      engine.voidElement("input")
    })
    expect(el.innerHTML).to.be.eq("<input>")
  })
})
