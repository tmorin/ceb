import {expect} from "chai";
import {html} from "./literal";

describe("literal/options", function () {
    let el: HTMLDivElement
    beforeEach(() => {
        if (el) {
            el.parentNode?.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should handle o:skip", function () {
        el.innerHTML = `<p><span>Hello, </span>World</p>`
        const template = html`<p><span o:skip></span>John</p>`
        template.render(el)
        expect(el.innerHTML).to.be.eq(`<p><span>Hello, </span>John</p>`)
    })
    it("should handle o:slop", function () {
        el.innerHTML = `<p><span>Hello, </span>World</p>`
        const template = html`<p><span o:skip></span>John</p>`
        template.render(el)
        expect(el.innerHTML).to.be.eq(`<p><span>Hello, </span>John</p>`)
    })
})
