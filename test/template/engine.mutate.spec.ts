import {expect} from "chai"
import {Engine} from "../../src/template/engine"

describe("patcher/engine/mutate", () => {
    let el
    beforeEach(() => {
        if (el) {
            el.parentNode.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should add nodes inside an element ", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.text("a text before")
            engine.openElement("p")
            engine.text("a text inside")
            engine.closeElement()
            engine.text("a text after")
        })
        expect(el.innerHTML).to.be.eq("a text before<p>a text inside</p>a text after")
        Engine.update(el, (engine) => {
            engine.text("a text before")
            engine.openElement("p")
            engine.text("a text inside")
            engine.text(" ")
            engine.text("and another text inside")
            engine.closeElement()
            engine.text("a text after")
        })
        expect(el.innerHTML).to.be.eq("a text before<p>a text inside and another text inside</p>a text after")
    })
    it("should remove nodes inside an element ", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.text("a text before")
            engine.openElement("p")
            engine.text("a text inside")
            engine.text(" ")
            engine.text("and another text inside")
            engine.closeElement()
            engine.text("a text after")
        })
        expect(el.innerHTML).to.be.eq("a text before<p>a text inside and another text inside</p>a text after")
        Engine.update(el, (engine) => {
            engine.text("a text before")
            engine.openElement("p")
            engine.text("a text inside")
            engine.closeElement()
            engine.text("a text after")
        })
        expect(el.innerHTML).to.be.eq("a text before<p>a text inside</p>a text after")
    })
    it("should replace nodes inside an element ", () => {
        el.innerHTML = ""
        Engine.update(el, (engine) => {
            engine.text("a text before")
            engine.openElement("p")
            engine.text("a text inside")
            engine.closeElement()
            engine.text("a text after")
        })
        expect(el.innerHTML).to.be.eq("a text before<p>a text inside</p>a text after")
        Engine.update(el, (engine) => {
            engine.text("a text before")
            engine.openElement("p")
            engine.text("another text inside")
            engine.closeElement()
            engine.text("a text after")
        })
        expect(el.innerHTML).to.be.eq("a text before<p>another text inside</p>a text after")
    })
})
