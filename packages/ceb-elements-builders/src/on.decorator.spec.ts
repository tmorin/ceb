import sinon, { SinonSpy } from "sinon"
import { assert } from "chai"
import { ElementBuilder } from "@tmorin/ceb-elements-core"
import { OnBuilder } from "./on"
import { listen } from "@tmorin/ceb-elements-testing"

describe("on.decorator", () => {
  let sandbox: HTMLDivElement
  beforeEach(function () {
    sandbox = document.body.appendChild(document.createElement("div"))
  })
  context("listen events", () => {
    const tagName = "el-listen-events"
    let onCustomEvenSpy: SinonSpy
    let handlerForASpy: SinonSpy
    let handlerForBSpy: SinonSpy
    let el: HTMLElement
    let event: CustomEvent = new CustomEvent("custom-event", {
      detail: "test value",
      bubbles: true,
    })
    beforeEach((done) => {
      onCustomEvenSpy = sinon.spy()
      handlerForASpy = sinon.spy()
      handlerForBSpy = sinon.spy()

      @ElementBuilder.get().name(tagName).decorate()
      class TestElement extends HTMLElement {
        @OnBuilder.get().decorate()
        onCustomEvent(data: Event, target: TestElement) {
          onCustomEvenSpy(data, target)
        }

        @OnBuilder.get("custom-event").delegate("input.a").decorate()
        handlerForA(data: Event, target: HTMLInputElement) {
          handlerForASpy(data, target)
        }

        @OnBuilder.get("custom-event").delegate("input.b").decorate()
        handlerForB(data: Event, target: HTMLInputElement) {
          handlerForBSpy(data, target)
        }

        connectedCallback() {
          this.innerHTML = `<div>
                        <input class="a">
                        <div>
                            <input class="b">
                        </div>
                    </div>`
        }
      }

      el = sandbox.appendChild(document.createElement(tagName))
      listen(sandbox, "custom-event", 2, done)
      el.querySelector("input.a")?.dispatchEvent(event)
      el.querySelector("input.b")?.dispatchEvent(event)
    })
    it("should invoke the bubbling and capture listeners", () => {
      assert.equal(onCustomEvenSpy.callCount, 2)
      assert.strictEqual(onCustomEvenSpy.getCall(0).args[0], event)
      assert.strictEqual(onCustomEvenSpy.getCall(0).args[1].tagName, tagName.toUpperCase())
      assert.strictEqual(onCustomEvenSpy.getCall(1).args[0], event)
      assert.strictEqual(onCustomEvenSpy.getCall(1).args[1].tagName, tagName.toUpperCase())
      assert.equal(handlerForASpy.callCount, 1)
      assert.strictEqual(handlerForASpy.getCall(0).args[0], event)
      assert.strictEqual(handlerForASpy.getCall(0).args[1].getAttribute("class"), "a")
      assert.equal(handlerForBSpy.callCount, 1)
      assert.strictEqual(handlerForBSpy.getCall(0).args[0], event)
      assert.strictEqual(handlerForBSpy.getCall(0).args[1].getAttribute("class"), "b")
    })
  })
})
