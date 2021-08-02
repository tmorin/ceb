import {expect} from "chai";
import {html} from "../../src";

describe("patcher/literal/slot", function () {
    let el: HTMLDivElement
    beforeEach(() => {
        if (el) {
            el.parentNode?.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should handle `o:slot`", function () {
        const word = "Hello"
        const template = html`<p>${word}, <span o:slot></span>!</p>`
        el.innerHTML = "World"
        template.render(el, {
            greyDom: true
        })
        expect(el.innerHTML).to.be.eq(`<p>Hello, <span>World</span>!</p>`)
    })
    it("should handle `ceb-slot`", function () {
        const word = "Hello"
        const template = html`<p>${word}, <ceb-slot></ceb-slot>!</p>`
        el.innerHTML = "World"
        template.render(el, {
            greyDom: true
        })
        expect(el.innerHTML).to.be.eq(`<p>Hello, <ceb-slot>World</ceb-slot>!</p>`)
    })
    it("should handle `slot`", function () {
        const word = "Hello"
        const template = html`<p>${word}, <slot></slot>!</p>`
        el.innerHTML = "World"
        template.render(el, {
            greyDom: true
        })
        expect(el.innerHTML).to.be.eq(`<p>Hello, <slot>World</slot>!</p>`)
    })
})
