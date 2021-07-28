import {assert} from "chai"
import {AttributeBuilder, AttributePropagationBuilder, ElementBuilder} from "../src"

describe("attribute_propagation", () => {
    let sandbox
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement("div"))
    })
    it("should propagate the attribute mutations", () => {
        const tagName = "propagate-attribute"

        class TestElement extends HTMLElement {
            constructor() {
                super()
                this.attachShadow({mode: "open"})
                this.shadowRoot.innerHTML = `<slot></slot><button></button>`
            }

            connectedCallback() {
                this.innerHTML = `<input/>`
            }
        }

        ElementBuilder.get(TestElement).name(tagName).builder(
            AttributePropagationBuilder.get(AttributeBuilder.get("value").default("default value")).to("input"),
            AttributePropagationBuilder.get(AttributeBuilder.get("disabled").boolean().default(true)).to("input"),
            AttributePropagationBuilder.get(AttributeBuilder.get("alt-type").default("text")).to("input").attribute("type"),
            AttributePropagationBuilder.get(AttributeBuilder.get("label").default("default label")).to("button").shadow().property("textContent"),
        ).register()
        const element = sandbox.appendChild(document.createElement(tagName)) as TestElement
        assert.ok(sandbox.querySelector(tagName))

        assert.strictEqual(element.getAttribute("value"), "default value")
        assert.strictEqual(element.querySelector("input").getAttribute("value"), "default value")

        assert.strictEqual(element.hasAttribute("disabled"), true)
        assert.strictEqual(element.querySelector("input").hasAttribute("disabled"), true)

        assert.strictEqual(element.getAttribute("alt-type"), "text")
        assert.strictEqual(element.querySelector("input").getAttribute("type"), "text")

        assert.strictEqual(element.getAttribute("label"), "default label")
        assert.strictEqual(element.shadowRoot.querySelector("button").textContent, "default label")
    })
})
