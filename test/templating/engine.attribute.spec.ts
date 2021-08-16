import {expect} from "chai"
import {Engine} from "../../src/templating/engine"

describe("templating/engine/attribute", () => {
    let el: HTMLDivElement
    beforeEach(() => {
        if (el) {
            el.parentNode?.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should set attributes", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.voidElement(
                "input",
                {
                    attributes: [["value", "1"], ["type", "number"]]
                }
            )
        })
        const input = el.firstElementChild as HTMLInputElement
        expect(input.getAttribute("value")).to.be.eq("1")
        expect(input.getAttribute("type")).to.be.eq("number")
        expect(input.value).to.be.eq("1")
        expect(input.valueAsNumber).to.be.eq(1)
    })
    it("should set boolean attributes", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.voidElement(
                "input",
                {
                    attributes: [["required", true]]
                }
            )
        })
        const input = el.firstElementChild as HTMLInputElement
        expect(input.hasAttribute("required")).to.be.eq(true)
        expect(input.required).to.be.eq(true)
    })
    it("should unset attributes", () => {
        el.innerHTML = `<p class="a_class_name"></p>`
        Engine.update(el, (engine) => {
            engine.openElement("p")
            engine.closeElement()
        })
        const p = el.firstElementChild as HTMLParagraphElement
        expect(p.hasAttribute("class")).to.be.eq(false)
    })
    it("should update attributes", () => {
        el.innerHTML = `<input type="number" value="1">`
        Engine.update(el, (engine) => {
            engine.voidElement(
                "input",
                {
                    attributes: [["value", "2"], ["type", "number"]]
                }
            )
        })
        const input = el.firstElementChild as HTMLInputElement
        expect(input.getAttribute("value")).to.be.eq("2")
        expect(input.getAttribute("type")).to.be.eq("number")
    })
})
