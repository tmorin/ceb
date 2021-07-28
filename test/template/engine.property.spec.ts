import {expect} from "chai"
import {Engine} from "../../src/template/engine"


describe("patcher/engine/property", () => {
    let el
    beforeEach(() => {
        if (el) {
            el.parentNode.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should set property", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.voidElement(
                "input",
                {
                    properties: [
                        ["value", "1"],
                        ["type", "number"],
                    ]
                }
            )
        })
        const input = el.firstElementChild as HTMLInputElement
        expect(input.getAttribute("type")).to.be.eq("number")
        expect(input.value).to.be.eq("1")
        expect(input.valueAsNumber).to.be.eq(1)
        expect(input[Engine.PROP_NAME_UPDATED_PROPERTIES]).to.include.members(["value", "type"])
    })
    it("should unset property", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.openElement(
                "p",
                {
                    properties: [["keyA", "valueA"]]
                }
            )
            engine.closeElement()
        })
        const p = el.firstElementChild as HTMLParagraphElement
        expect(p).to.have.property("keyA")
        expect(p[Engine.PROP_NAME_UPDATED_PROPERTIES]).to.include.members(["keyA"])
        Engine.update(el, (engine) => {
            engine.openElement("p")
            engine.closeElement()
        })
        expect(p["keyA"]).to.be.eq(undefined)
        expect(p[Engine.PROP_NAME_UPDATED_PROPERTIES]).to.have.lengthOf(0)
    })
})
