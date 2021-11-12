import {assert} from "chai";
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
        const template = html`
            <ul>start
                ${html`
                    <li>hello</li>`}
                middle
                ${html`
                    <li>world</li>`}
                end
            </ul>`
        template.render(el)
        assert.ok(el.querySelector("ul"))
        assert.equal(el.querySelector("ul li:nth-child(1)")?.textContent, "hello")
        assert.equal(el.querySelector("ul li:nth-child(2)")?.textContent, "world")
        assert.equal(el.querySelector("ul")?.textContent?.replace(/\n/g, " ").replace(/\s+/g, " ").trim(), "start hello middle world end")
    })
    it("should handle list of sub template instance", function () {
        const list = ["itemA", "itemB", "itemC"]
        const template = html`
            <ul>
                <li>header</li>
                ${list.map(v => html`
                    <li>${v}</li>`)}
                <li>footer</li>
            </ul>`
        template.render(el)
        assert.ok(el.querySelector("ul"))
        assert.equal(el.querySelector("ul li:nth-child(1)")?.textContent, "header")
        assert.equal(el.querySelector("ul li:nth-child(2)")?.textContent, "itemA")
        assert.equal(el.querySelector("ul li:nth-child(3)")?.textContent, "itemB")
        assert.equal(el.querySelector("ul li:nth-child(4)")?.textContent, "itemC")
        assert.equal(el.querySelector("ul li:nth-child(5)")?.textContent, "footer")
    })
    it("should handle a bulma card", function () {
        let cardName = "The name of the card"
        let cardDescription = "The description of the card."
        const template = html`
            <div class="card">
                <div class="card-header">
                    <p class="card-header-title">
                        ${cardName}
                    </p>
                </div>
                <div class="card-content">
                    <div class="content">
                        ${cardDescription}
                    </div>
                </div>
            </div>`
        template.render(el)
        assert.ok(el.querySelector("div.card"))
        assert.ok(el.querySelector("div.card div.card-header"))
        assert.ok(el.querySelector("div.card div.card-header p.card-header-title"))
        assert.ok(el.querySelector("div.card div.card-content"))
        assert.ok(el.querySelector("div.card div.card-content div.content"))
    })
    it("should handle a bulma panel block", function () {
        let identifier = "identifier"
        let label = "label"
        let kindA = "kindA"
        let kindB = "kindB"
        const template = html`<a class="panel-block" href="#/abb/edit/${identifier}">
            ${label}
            <small class="is-flex">${kindA}</small>
            <small class="is-flex">${kindB}</small>
        </a>`
        template.render(el)
        assert.ok(el.querySelector("a.panel-block"))
        assert.equal(el.querySelector("a.panel-block small:nth-child(1)")?.textContent, kindA)
        assert.equal(el.querySelector("a.panel-block small:nth-child(2)")?.textContent, kindB)
    })
})
