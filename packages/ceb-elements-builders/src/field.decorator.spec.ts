import { assert } from "chai"
import sinon from "sinon"
import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { FieldBuilder, FieldListenerData } from "./field"

describe("field.decorator", () => {
  let sandbox: HTMLDivElement
  beforeEach(function () {
    sandbox = document.body.appendChild(document.createElement("div"))
  })
  it("should create field", () => {
    const tagName = "el-default-field"

    @ElementBuilder.get().name(tagName).decorate()
    class TestElement extends HTMLElement {
      @FieldBuilder.get().decorate()
      altName = "a field"
    }

    const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
    assert.ok(sandbox.querySelector(tagName))
    assert.strictEqual(el.altName, "a field")
    assert.strictEqual(el.getAttribute("alt-name"), "a field")
  })
  it("should create boolean field", () => {
    const tagName = "el-boolean-field"

    @ElementBuilder.get().name(tagName).decorate()
    class TestElement extends HTMLElement {
      @FieldBuilder.get().boolean().decorate()
      altName = true
    }

    const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
    assert.ok(sandbox.querySelector(tagName))
    assert.strictEqual(el.altName, true)
    assert.strictEqual(el.getAttribute("alt-name"), "")
  })
  it("should override attribute name", () => {
    const tagName = "el-attribute-field"

    @ElementBuilder.get().name(tagName).decorate()
    class TestElement extends HTMLElement {
      @FieldBuilder.get().attribute("an-attribute").decorate()
      altName = "a field"
    }

    const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
    assert.ok(sandbox.querySelector(tagName))
    assert.strictEqual(el.altName, "a field")
    assert.strictEqual(el.getAttribute("an-attribute"), "a field")
  })
  it("should listen changes", () => {
    const tagName = "el-listen-field"
    const listener = sinon.spy()

    @ElementBuilder.get().name(tagName).decorate()
    class TestElement extends HTMLElement {
      @FieldBuilder.get().decorate()
      altName = "a field"

      @FieldBuilder.get().decorate()
      onAltName(data: FieldListenerData) {
        listener(data)
      }
    }

    const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
    assert.ok(sandbox.querySelector(tagName))
    assert.strictEqual(el.altName, "a field")
    assert.strictEqual(el.getAttribute("alt-name"), "a field")
    el.altName = "new name"
    assert.ok(listener.called)
    assert.ok(listener.calledWithMatch(sinon.match.has("newVal", "new name")))
  })
  it("should listen changes with prefix", () => {
    const tagName = "el-listen-field-with-prefix"
    const listener = sinon.spy()

    @ElementBuilder.get().name(tagName).decorate()
    class TestElement extends HTMLElement {
      @FieldBuilder.get().decorate()
      altName = "a field"

      @FieldBuilder.get().decorate("on_")
      on_altName(data: FieldListenerData) {
        listener(data)
      }
    }

    const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
    assert.ok(sandbox.querySelector(tagName))
    assert.strictEqual(el.altName, "a field")
    assert.strictEqual(el.getAttribute("alt-name"), "a field")
    el.altName = "new name"
    assert.ok(listener.called)
    assert.ok(listener.calledWithMatch(sinon.match.has("newVal", "new name")))
  })
  it("should listen changes to an alternate attribute", () => {
    const tagName = "el-listen-field-alternate-attribute"
    const listener = sinon.spy()

    @ElementBuilder.get().name(tagName).decorate()
    class TestElement extends HTMLElement {
      @FieldBuilder.get().attribute("an-attribute").decorate()
      altName = "a field"

      @FieldBuilder.get().decorate()
      onAltName(data: FieldListenerData) {
        listener(data)
      }
    }

    const el = sandbox.appendChild(document.createElement(tagName) as TestElement)
    assert.ok(sandbox.querySelector(tagName))
    assert.strictEqual(el.altName, "a field")
    assert.strictEqual(el.getAttribute("an-attribute"), "a field")
    el.altName = "new name"
    assert.ok(listener.called)
    assert.ok(listener.calledWithMatch(sinon.match.has("newVal", "new name")))
  })
})
