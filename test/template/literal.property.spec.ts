import {expect} from "chai";
import {html} from "../../src";

describe("patcher/literal/property", function () {
    let el
    beforeEach(() => {
        if (el) {
            el.parentNode.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should parse properties", function () {
        const placeholder = "a placeholder"
        const template = html`<p><input p:type="number" p:placeholder="${placeholder}" ></p>`
        template.render(el)
        expect(el.innerHTML).to.be.eq(`<p><input type="number" placeholder="a placeholder"></p>`)
    })
    it("should parse complex properties", function () {
        const foo = "foo"
        const bar = "bar"
        const template = html`<p><input p:type="text" p:name="${foo}" p:value="before ${bar} after" ></p>`
        template.render(el)
        const input: HTMLInputElement = el.querySelector("input")
        expect(input.type).to.be.eq("text")
        expect(input.name).to.be.eq("foo")
        expect(input.value).to.be.eq("before bar after")
    })
})
