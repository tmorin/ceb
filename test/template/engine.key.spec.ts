import {Engine} from "../../src/template/engine"
import {expect} from "chai"

describe("patcher/engine/key", function () {
    let el

    beforeEach(() => {
        if (el) {
            el.parentNode.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should handle referenced element", function () {
        Engine.updateElement(el, (engine: Engine) => {
            engine.openElement("ul")
            engine.openElement("li", {attributes: [["name", "A"]], options: {key: 'A'}})
            engine.text('A')
            engine.closeElement()
            engine.openElement("li", {attributes: [["name", "B"]], options: {key: 'B'}})
            engine.text('B')
            engine.closeElement()
            engine.closeElement()
        })
        const liA = el.querySelector("li[name=A]")
        const liB = el.querySelector("li[name=B]")
        expect(liA.getAttribute("name")).eq('A')
        expect(liB.getAttribute("name")).eq('B')
        Engine.updateElement(el, (engine: Engine) => {
            engine.openElement("ul")
            engine.openElement("li", {attributes: [["name", "B bis"]], options: {key: 'B'}})
            engine.text('B bis')
            engine.closeElement()
            engine.openElement("li", {attributes: [["name", "A bis"]], options: {key: 'A'}})
            engine.text('A bis')
            engine.closeElement()
            engine.closeElement()
        })
        expect(liA.getAttribute("name")).eq('A bis')
        expect(liB.getAttribute("name")).eq('B bis')
    })
})
