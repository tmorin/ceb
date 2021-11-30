import { assert } from "chai"
import { ElementBuilder } from "./element"

describe("element.decorator", () => {
  let sandbox: HTMLDivElement
  beforeEach(function () {
    sandbox = document.body.appendChild(document.createElement("div"))
  })
  it("should create with decorator", () => {
    const tagName = "test-element"

    @ElementBuilder.get().name(tagName).decorate()
    class TestElement extends HTMLElement {
      altName = "a name"

      connectedCallback() {
        this.setAttribute("att0", "val0")
      }
    }

    const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
    assert.ok(sandbox.querySelector(tagName))
    assert.strictEqual(el.altName, "a name")
    assert.strictEqual(el.getAttribute("att0"), "val0")
  })
  it("should create a customized built-in element with decorator", () => {
    const tagName = "input-test"

    @ElementBuilder.get().name(tagName).extends("input").decorate()
    class InputTestElement extends HTMLInputElement {
      altName = "a name"

      constructor() {
        super()
      }

      connectedCallback() {
        this.setAttribute("att0", "val0")
      }
    }

    const el = sandbox.appendChild(document.createElement("input", { is: tagName }) as InputTestElement)
    {
      const input = sandbox.querySelector("input")
      assert.ok(input instanceof InputTestElement)
      assert.strictEqual(input?.outerHTML, `<input is="${tagName}" att0="val0">`)
    }
    assert.strictEqual(el.altName, "a name")
    assert.strictEqual(el.getAttribute("att0"), "val0")
  })
})
