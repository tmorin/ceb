import { expect } from "chai"
import { ContextItem, Engine } from "./engine"

describe("engine/property", () => {
  let el: HTMLDivElement
  beforeEach(() => {
    if (el) {
      el.parentNode?.removeChild(el)
    }
    el = document.body.appendChild(document.createElement("div"))
  })
  it("should set property", () => {
    el.innerHTML = ""
    Engine.update(el, (engine) => {
      engine.voidElement("input", {
        properties: [
          ["value", "1"],
          ["type", "number"],
        ],
      })
    })
    const input = el.firstElementChild as HTMLInputElement & ContextItem
    expect(input.getAttribute("type")).to.be.eq("number")
    expect(input.value).to.be.eq("1")
    expect(input.valueAsNumber).to.be.eq(1)
    expect(input.__ceb_engine_updated_properties).to.include.members(["value", "type"])
  })
  it("should unset property", () => {
    el.innerHTML = ""
    Engine.update(el, (engine) => {
      engine.openElement("p", {
        properties: [["keyA", "valueA"]],
      })
      engine.closeElement()
    })
    const p = el.firstElementChild as HTMLParagraphElement & ContextItem
    expect(p).to.have.property("keyA").eq("valueA")
    expect(p.__ceb_engine_updated_properties).to.include.members(["keyA"])
    Engine.update(el, (engine) => {
      engine.openElement("p")
      engine.closeElement()
    })
    expect(p).to.have.property("keyA").eq(undefined)
    expect(p.__ceb_engine_updated_properties).to.have.lengthOf(0)
  })
})
