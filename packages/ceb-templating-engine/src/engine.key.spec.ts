import { expect } from "chai"
import { Engine } from "./engine"

describe("engine/key", function () {
  let el: HTMLDivElement
  beforeEach(() => {
    if (el) {
      el.parentNode?.removeChild(el)
    }
    el = document.body.appendChild(document.createElement("div"))
  })
  it("should shift referenced elements", function () {
    Engine.update(el, (engine: Engine) => {
      engine.openElement("ul")
      engine.openElement("li", { attributes: [["name", "A"]], options: { key: "A" } })
      engine.text("A")
      engine.closeElement()
      engine.openElement("li", { attributes: [["name", "B"]], options: { key: "B" } })
      engine.text("B")
      engine.closeElement()
      engine.closeElement()
    })
    const liA = el.querySelector("li[name=A]") as HTMLLIElement
    const liB = el.querySelector("li[name=B]") as HTMLLIElement
    expect(liA.getAttribute("name")).eq("A")
    expect(liB.getAttribute("name")).eq("B")
    Engine.update(el, (engine: Engine) => {
      engine.openElement("ul")
      engine.openElement("li", { attributes: [["name", "B bis"]], options: { key: "B" } })
      engine.text("B bis")
      engine.closeElement()
      engine.openElement("li", { attributes: [["name", "A bis"]], options: { key: "A" } })
      engine.text("A bis")
      engine.closeElement()
      engine.closeElement()
    })
    expect(liA.getAttribute("name")).eq("A bis")
    expect(liB.getAttribute("name")).eq("B bis")
  })
  it("should handles injected of referenced elements", function () {
    Engine.update(el, (engine: Engine) => {
      engine.openElement("ul")
      engine.openElement("li", { attributes: [["name", "B"]], options: { key: "B" } })
      engine.text("B")
      engine.closeElement()
      engine.closeElement()
    })
    const liB = el.querySelector("li[name=B]") as HTMLLIElement
    expect(liB.getAttribute("name")).eq("B")
    Engine.update(el, (engine: Engine) => {
      engine.openElement("ul")
      engine.openElement("li", { attributes: [["name", "A"]], options: { key: "A" } })
      engine.text("A")
      engine.closeElement()
      engine.openElement("li", { attributes: [["name", "B"]], options: { key: "B" } })
      engine.text("B")
      engine.closeElement()
      engine.closeElement()
    })
    const liA = el.querySelector("li[name=A]") as HTMLLIElement
    expect(liA.getAttribute("name")).eq("A")
    expect(liB.getAttribute("name")).eq("B")
  })
  it("should handle override of referenced elements", function () {
    Engine.update(el, (engine: Engine) => {
      engine.openElement("ul")
      engine.openElement("li", { attributes: [["name", "A"]], options: { key: "A" } })
      engine.text("A")
      engine.closeElement()
      engine.closeElement()
    })
    const liA = el.querySelector("li[name=A]") as HTMLLIElement
    expect(liA.getAttribute("name")).eq("A")
    Engine.update(el, (engine: Engine) => {
      engine.openElement("ul")
      engine.openElement("li", { attributes: [["name", "B"]], options: { key: "B" } })
      engine.text("B")
      engine.closeElement()
      engine.closeElement()
    })
    const liB = el.querySelector("li[name=B]") as HTMLLIElement
    expect(liB.getAttribute("name")).eq("B")
  })
})
