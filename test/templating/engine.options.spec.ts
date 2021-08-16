import {expect} from "chai"
import {Engine} from "../../src/templating/engine"

describe("templating/engine/options", () => {
    let el: HTMLDivElement
    beforeEach(() => {
        if (el) {
            el.parentNode?.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    describe("preserveChildren", function () {
        it("should preserve children", () => {
            el.innerHTML = `<div><ul class="a_call_name"><li>liA</li><li>liB</li></ul></div>`
            Engine.update(el, (engine) => {
                engine.openElement("div")
                engine.openElement("ul", {
                    attributes: [["class", "another_call_name"]],
                    options: {
                        skip: true
                    }
                })
                engine.closeElement()
                engine.closeElement()
            })
            expect(el.innerHTML).to.be.eq(`<div><ul class="another_call_name"><li>liA</li><li>liB</li></ul></div>`)
        })
    })
})
