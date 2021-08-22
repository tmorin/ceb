import {expect} from "chai";
import {html} from "./literal";

describe("literal/complex", function () {
    let el: HTMLDivElement
    beforeEach(() => {
        if (el) {
            el.parentNode?.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should handle sub template instances", function () {
        const template = html`<ul>start${html`<li>hello</li>`}middle${html`<li>world</li>`}end</ul>`
        template.render(el)
        expect(el.innerHTML).to.be.eq(`<ul>start<li>hello</li>middle<li>world</li>end</ul>`)
    })
    it("should handle list of sub template instance", function () {
        const list = ["itemA", "itemB", "itemC"]
        const template = html`<ul><li>header</li>${list.map(v => html`<li>${v}</li>`)}<li>footer</li></ul>`
        template.render(el)
        expect(el.innerHTML).to.be.eq(`<ul><li>header</li><li>itemA</li><li>itemB</li><li>itemC</li><li>footer</li></ul>`)
    })
})
