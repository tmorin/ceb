import {Engine} from "../../src/template/engine"
import {expect} from "chai"

describe("patcher/engine/slot", function () {
    let el

    beforeEach(() => {
        if (el) {
            el.parentNode.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should handle Grey DOM", function () {
        el.innerHTML = `<strong>World</strong>`
        const render = (engine: Engine) => {
            engine.openElement("div")
            engine.text("Hello, ")
            engine.slot()
            engine.text("!")
            engine.closeElement()
        }
        Engine.updateElement(el, render, {greyDom: true})
        expect(el.innerHTML).to.be.eq(`<div>Hello, <fc-slot><strong>World</strong></fc-slot>!</div>`)

        el.querySelector("fc-slot").innerHTML = `<u>John <strong>Doe</strong></u>`
        Engine.updateElement(el, render, {greyDom: true})
        expect(el.innerHTML).to.be.eq(`<div>Hello, <fc-slot><u>John <strong>Doe</strong></u></fc-slot>!</div>`)
    })
    it("should handle a chain of Grey DOM", function () {
        el.innerHTML = `<ul>
            <render-c>
                <ul>
                    <render-b>
                        <ul>
                            <render-a>
                                John <strong>Doe</strong>
                            </render-a>
                        </ul>
                    </render-b>
                </li>
            </render-c>
        </ul>`

        const renderFactor = (id: string) => (engine: Engine) => {
            engine.openElement("li")
            engine.text(`${id}_before[`)
            engine.slot()
            engine.text(`${id}]_after`)
            engine.closeElement()
        }

        Engine.updateElement(el.querySelector("render-a"), renderFactor("a"), {greyDom: true})
        Engine.updateElement(el.querySelector("render-b"), renderFactor("b"), {greyDom: true})
        Engine.updateElement(el.querySelector("render-c"), renderFactor("c"), {greyDom: true})

        const strong = el.querySelector("ul render-c li fc-slot ul render-b li fc-slot ul render-a li fc-slot strong");
        expect(strong.textContent).to.be.eq("Doe")
    })
    it("should handle custom elements", function () {
        class LiSlot extends HTMLElement {
            static get observedAttributes() {
                return ["label"]
            }

            attributeChangedCallback(attrName, oldVal, newVal) {
                this.render()
            }

            render() {
                Engine.updateElement(this, (engine: Engine) => {
                    engine.openElement("li")
                    engine.text(this.getAttribute("label"))
                    engine.slot()
                    engine.closeElement()
                }, {greyDom: true})
            }
        }

        class LiSlotAlt extends HTMLElement {
            static get observedAttributes() {
                return ["title", "label"]
            }

            connectedCallback() {
                this.setAttribute("label", "title")
            }

            attributeChangedCallback(attrName, oldVal, newVal) {
                this.render()
            }

            render() {
                Engine.updateElement(this, (engine: Engine) => {
                    engine.openElement("li")
                    const title = this.getAttribute("title")
                    if (title) {
                        const label = this.getAttribute("label")
                        engine.openElement("small")
                        engine.text(`(${label}:${title}) `)
                        engine.closeElement()
                    }
                    engine.slot()
                    engine.closeElement()
                }, {greyDom: true})
            }
        }

        customElements.define("li-slot", LiSlot)
        customElements.define("li-slot-alt", LiSlotAlt)

        el.innerHTML = `<ul>
            <li-slot class="first" label="person">
                <ul>
                    <li-slot class="second" label="name">
                        <ul>
                            <li-slot-alt>John <strong>Doe</strong></li-slot-alt>
                        </ul>
                    </li-slot>
                </li>
            </li-slot>
        </ul>`

        const firstLiSlot = () => el.querySelector("li-slot.first")
        const secondLiSlot = () => el.querySelector("li-slot.second")
        const liSlotAlt = () => el.querySelector("li-slot-alt")

        expect(firstLiSlot().firstChild.firstChild.textContent).to.be.eq("person")
        expect(secondLiSlot().firstChild.firstChild.textContent).to.be.eq("name")
        expect(liSlotAlt().firstChild.firstChild.textContent).to.be.eq("John Doe")

        secondLiSlot().setAttribute("label", "alt name")
        expect(firstLiSlot().firstChild.firstChild.textContent).to.be.eq("person")
        expect(secondLiSlot().firstChild.firstChild.textContent).to.be.eq("alt name")
        expect(liSlotAlt().firstChild.firstChild.textContent).to.be.eq("John Doe")

        liSlotAlt().setAttribute("title", "unknown")
        expect(firstLiSlot().firstChild.firstChild.textContent).to.be.eq("person")
        expect(secondLiSlot().firstChild.firstChild.textContent).to.be.eq("alt name")
        expect(liSlotAlt().firstChild.firstChild.textContent).to.be.eq("(title:unknown) ")
        expect(liSlotAlt().firstChild.innerHTML).to.be.eq("<small>(title:unknown) </small><fc-slot>John <strong>Doe</strong></fc-slot>")
    })
    it("should handle custom elements bis", function () {
        class ChildSlot extends HTMLElement {
            connectedCallback() {
                this.render()
            }

            render() {
                Engine.updateElement(this, (engine: Engine) => {
                    engine.openElement("div", {attributes: [["class", "child"]]})
                    engine.text("child")
                    engine.slot()
                    engine.closeElement()
                }, {greyDom: true})
            }
        }

        class ParentSlot extends HTMLElement {
            connectedCallback() {
                this.render()
            }

            render() {
                Engine.updateElement(this, (engine: Engine) => {
                    engine.openElement("div", {attributes: [["class", "parent"]]})
                    engine.text("parent")
                    engine.openElement("child-slot", {options: {slot: true}})
                    engine.closeElement()
                    engine.closeElement()
                }, {greyDom: true})
            }
        }

        customElements.define("parent-slot", ParentSlot)
        customElements.define("child-slot", ChildSlot)

        el.innerHTML = `<parent-slot><div>John Doe</div></parent-slot>`
        expect(el.querySelector("parent-slot div.parent child-slot div.child fc-slot").textContent).to.be.eq("John Doe")
    })
})
