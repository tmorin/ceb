import {expect} from "chai"
import {Engine} from "../../src/templating/engine"

describe("templating/engine/simple", () => {
    let el: HTMLDivElement
    beforeEach(() => {
        if (el) {
            el.parentNode?.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should render a simple element", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.openElement("p")
            engine.closeElement()
        })
        expect(el.innerHTML).to.be.eq("<p></p>")
    })
    it("should render a simple void element", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.voidElement("input")
        })
        expect(el.innerHTML).to.be.eq("<input>")
    })
    it("should render a simple text node", () => {
        el.innerHTML = ""
    })
    it("should render a simple comment node", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.comment("a comment")
        })
        expect(el.innerHTML).to.be.eq("<!--a comment-->")
    })
    it("should render a simple p element and a text node", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.openElement("p")
            engine.text("hello")
            engine.closeElement()
        })
        expect(el.innerHTML).to.be.eq("<p>hello</p>")
    })
})
