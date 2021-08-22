import {assert} from 'chai'
import {ElementBuilder} from "@tmorin/ceb-core";
import {ReferenceBuilder} from "./reference";

describe('reference.decorator', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
    })
    it('should manage reference', () => {
        const tagName = 'reference-decorator'

        @ElementBuilder.get().name(tagName).decorate()
        class TestElement extends HTMLElement {
            @ReferenceBuilder.get().selector("ul").shadow().decorate()
            ul?: HTMLUListElement
            @ReferenceBuilder.get().shadow().decorate()
            anId?: HTMLUListElement
            @ReferenceBuilder.get().shadow().array().selector("li").decorate()
            lis?: Array<HTMLLIElement>
        }

        const el: TestElement = sandbox.appendChild(document.createElement(tagName))
        el.attachShadow({mode: 'open'}).innerHTML = `<ul id="anId"><li class="li0"></li><li class="li0"></li></ul>`
        assert.ok(sandbox.querySelector(tagName))
        assert.ok(el.ul)
        assert.strictEqual(el.ul?.tagName, 'UL')
        assert.ok(el.anId)
        assert.strictEqual(el.anId?.tagName, 'UL')
        assert.ok(el.lis)
        assert.strictEqual(el.lis?.length, 2)
    })
})
