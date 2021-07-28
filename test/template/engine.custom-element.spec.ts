import {Engine} from "../../src/template/engine";
import {expect} from "chai";

describe("patcher/engine/custom-element", function () {
    let el
    beforeEach(() => {
        if (el) {
            el.parentNode.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
    })
    it("should handle the `__fn_preserve_children` property", () => {
        class TestRegularCustomElement extends HTMLElement {
            constructor() {
                super();
                this[Engine.PROP_NAME_PRESERVE_CHILDREN] = true
            }

            connectedCallback() {
                this.textContent = "initial text content"
            }
        }

        window.customElements.define("test-regular-custom-element", TestRegularCustomElement)
        el.innerHTML = ``
        Engine.update(el, (engine) => {
            engine.openElement("div")
            engine.openElement("test-regular-custom-element")
            engine.closeElement()
            engine.closeElement()
        })
        expect(el.innerHTML).to.be.eq(`<div><test-regular-custom-element>initial text content</test-regular-custom-element></div>`)
        el.querySelector("test-regular-custom-element").textContent = "updated text content"
        Engine.update(el, (engine) => {
            engine.openElement("div")
            engine.openElement("test-regular-custom-element")
            engine.closeElement()
            engine.closeElement()
        })
        expect(el.innerHTML).to.be.eq(`<div><test-regular-custom-element>updated text content</test-regular-custom-element></div>`)
    })
    it("should create extended Custom Element", () => {
        class TestInputCustomElement extends HTMLInputElement {
            test() {
                return "test"
            }
        }

        window.customElements.define("test-input-custom-element", TestInputCustomElement, {extends: "input"})
        el.innerHTML = ``
        Engine.update(el, (engine) => {
            engine.openElement("div")
            engine.voidElement("input", {
                    attributes: [["is", "test-input-custom-element"]]
                }
            )
            engine.closeElement()
        })
        expect(el.innerHTML).to.be.eq(`<div><input is="test-input-custom-element"></div>`)
        expect(el.querySelector("input[is=test-input-custom-element]").test()).to.be.eq("test")
    })
    it("should preserve attributes", () => {
        class TestAttributesCustomElement extends HTMLInputElement {
            constructor() {
                super();
                this[Engine.PROP_NAME_PRESERVE_ATTRIBUTES] = ["type", "placeholder"]
                this.type = "number"
                this.placeholder = "type a number"
            }
        }

        window.customElements.define("test-attributes-custom-element", TestAttributesCustomElement, {extends: "input"})
        el.innerHTML = ``
        Engine.update(el, (engine) => {
            engine.openElement("div")
            engine.voidElement("input", {
                    attributes: [["is", "test-attributes-custom-element"]]
                }
            )
            engine.closeElement()
        })
        expect(el.innerHTML).to.be.eq(`<div><input type="number" placeholder="type a number" is="test-attributes-custom-element"></div>`)
    })
})
