import {expect} from "chai"
import {Engine} from "../../src/template/engine"

describe("patcher/engine/complex", () => {
    let el
    beforeEach(() => {
        if (el) {
            el.parentNode.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should render a complex structure", () => {
        el.innerHTML = ``
        Engine.update(el, (engine) => {
            engine.openElement("ul")
            engine.openElement("li")
            engine.text("liA")
            engine.closeElement()
            engine.openElement("li")
            engine.text("liB")
            engine.closeElement()
            engine.closeElement()
        })
        expect(el.innerHTML).to.be.eq(`<ul><li>liA</li><li>liB</li></ul>`)
    })
})
