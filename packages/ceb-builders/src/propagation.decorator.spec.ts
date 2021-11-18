import {assert} from "chai"
import {ElementBuilder} from "@tmorin/ceb-elements-core";
import {AttributePropagationBuilder} from "./propagation";
import {AttributeBuilder} from "./attribute";

describe("attribute_propagation.decorator", () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it("should propagate the attribute mutations", () => {
        const tagName = "delegate-attribute-decorator"

        @ElementBuilder.get().name(tagName).decorate()
        @AttributePropagationBuilder.get(
            AttributeBuilder.get("value").default("default value")
        ).to("input").decorate()
        @AttributePropagationBuilder.get(
            AttributeBuilder.get("disabled").default(true)
        ).to("input").decorate()
        @AttributePropagationBuilder.get(
            AttributeBuilder.get("alt-type").default("text")
        ).to("input").property("type").decorate()
        @AttributePropagationBuilder.get(
            AttributeBuilder.get("label").default("default label")
        ).to("button").property("textContent").shadow().decorate()
        class TestElement extends HTMLElement {
            constructor() {
                super()
                this.attachShadow({mode: "open"}).innerHTML = `<slot></slot><button></button>`
            }

            connectedCallback() {
                this.innerHTML = `<input/>`
            }
        }

        const element = sandbox.appendChild(document.createElement(tagName) as TestElement)
        assert.ok(sandbox.querySelector(tagName))

        assert.strictEqual(element.getAttribute("value"), "default value")
        assert.strictEqual(element.querySelector("input")?.getAttribute("value"), "default value")

        assert.strictEqual(element.hasAttribute("disabled"), true)
        assert.strictEqual(element.querySelector("input")?.hasAttribute("disabled"), true)

        assert.strictEqual(element.getAttribute("alt-type"), "text")
        assert.strictEqual(element.querySelector("input")?.getAttribute("type"), "text")

        assert.strictEqual(element.getAttribute("label"), "default label")
        assert.strictEqual(element.shadowRoot?.querySelector("button")?.textContent, "default label")
    })
})
