import { assert } from "chai"
import sinon, { SinonSpy } from "sinon"
import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { getTagName } from "@tmorin/ceb-elements-testing"
import { FieldBuilder } from "./field"

describe("field", () => {
  let sandbox: HTMLDivElement
  beforeEach(function () {
    sandbox = document.body.appendChild(document.createElement("div"))
  })
  it("should manage string and boolean fields", () => {
    class ShouldManageStringBooleanFields extends HTMLElement {
      altString = "a default string"
      altStringNoDefault: any
      altBoolean = true
      altBooleanBis = false
    }

    ElementBuilder.get(ShouldManageStringBooleanFields)
      .builder(
        FieldBuilder.get("altString"),
        FieldBuilder.get("altStringNoDefault"),
        FieldBuilder.get("altBoolean").boolean(),
        FieldBuilder.get("altBooleanBis").boolean()
      )
      .register()
    const tagName = getTagName(ShouldManageStringBooleanFields)
    const element = sandbox.appendChild(document.createElement(tagName) as ShouldManageStringBooleanFields)
    assert.ok(sandbox.querySelector(tagName))

    // check default values
    assert.strictEqual(element.altString, "a default string")
    assert.strictEqual(element.getAttribute("alt-string"), "a default string")
    assert.strictEqual(element.altStringNoDefault, null)
    assert.strictEqual(element.getAttribute("alt-string-no-default"), null)
    assert.strictEqual(element.altBoolean, true)
    assert.strictEqual(element.hasAttribute("alt-boolean"), true)
    assert.strictEqual(element.altBooleanBis, false)
    assert.strictEqual(element.hasAttribute("alt-boolean-bis"), false)

    // check string updated from attribute
    element.setAttribute("alt-string", "another string")
    assert.strictEqual(element.altString, "another string")

    // check string updated from property
    element.altString = "another string bis"
    assert.strictEqual(element.getAttribute("alt-string"), "another string bis")

    // check boolean switched from attribute
    element.removeAttribute("alt-boolean")
    assert.strictEqual(element.altBoolean, false)

    // check boolean switched from property
    element.altBoolean = true
    assert.strictEqual(element.hasAttribute("alt-boolean"), true)
  })

  it("should listen to values", () => {
    const spy1: SinonSpy = sinon.spy()
    const spy2: SinonSpy = sinon.spy()
    const spy3: SinonSpy = sinon.spy()

    class ShouldListenDefaultValue extends HTMLElement {
      altString: string | null = "a default value"
      altStringBis: any
      altBoolean = true
    }

    ElementBuilder.get(ShouldListenDefaultValue)
      .builder(
        FieldBuilder.get("altString").listener(spy1),
        FieldBuilder.get("altBoolean").boolean().listener(spy2),
        FieldBuilder.get("altStringBis").listener(spy3)
      )
      .register()
    const tagName = getTagName(ShouldListenDefaultValue)
    const el = sandbox.appendChild(document.createElement(tagName) as ShouldListenDefaultValue)
    assert.ok(sandbox.querySelector(tagName))
    assert.ok(spy1.calledOnce)
    assert.ok(spy2.calledOnce)
    el.setAttribute("alt-string-bis", "a new value")
    assert.ok(spy3.calledOnce)

    spy1.resetHistory()
    el.altString = "another value"
    assert.ok(spy1.calledOnce)

    spy1.resetHistory()
    el.altString = "another value"
    assert.ok(spy1.notCalled)

    spy1.resetHistory()
    el.altString = null
    assert.ok(spy1.calledOnce)
  })

  it("should bind to another attribute", () => {
    class ShouldBindToAnotherAttribute extends HTMLElement {
      altString = "a default value"
    }

    ElementBuilder.get(ShouldBindToAnotherAttribute)
      .builder(FieldBuilder.get("altString").attribute("alt-attr"))
      .register()
    const tagName = getTagName(ShouldBindToAnotherAttribute)
    const el = sandbox.appendChild(document.createElement(tagName) as ShouldBindToAnotherAttribute)
    assert.ok(sandbox.querySelector(tagName))

    assert.strictEqual(el.getAttribute("alt-attr"), "a default value")
    el.altString = "another value"
    assert.strictEqual(el.getAttribute("alt-attr"), "another value")

    el.setAttribute("alt-attr", "another value bis")
    assert.strictEqual(el.altString, "another value bis")
  })

  it("should get default value from HTML", () => {
    class FieldShouldGetDefaultFromHtml extends HTMLElement {
      altString = "a default value"
      altStringBis?: string
      altBoolean?: boolean
    }

    ElementBuilder.get(FieldShouldGetDefaultFromHtml)
      .builder(
        FieldBuilder.get("altString"),
        FieldBuilder.get("altStringBis"),
        FieldBuilder.get("altBoolean").boolean()
      )
      .register()
    const tagName = getTagName(FieldShouldGetDefaultFromHtml)
    sandbox.innerHTML =
      '<field-should-get-default-from-html alt-string="a new string" alt-string-bis="a new bis string" alt-boolean=""/>'
    const el = sandbox.querySelector(tagName) as FieldShouldGetDefaultFromHtml
    assert.ok(el)

    assert.strictEqual(el.getAttribute("alt-string"), "a new string")
    assert.strictEqual(el.altString, "a new string")

    assert.strictEqual(el.getAttribute("alt-string-bis"), "a new bis string")
    assert.strictEqual(el.altStringBis, "a new bis string")

    assert.strictEqual(el.hasAttribute("alt-boolean"), true)
    assert.strictEqual(el.altBoolean, true)
  })
})
