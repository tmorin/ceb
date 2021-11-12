import {expect} from 'chai'
import {Attribute, parse} from "./parser"

type ParseEvent = {
    name: 'text' | 'comment' | 'openTag' | 'closeTag',
    detail: any
}

function executeParse(html: string): Array<ParseEvent> {
    const stack: Array<ParseEvent> = []
    parse(html, {
        text(data: string) {
            stack.push({
                name: "text",
                detail: {data}
            })
        },
        comment(data: string) {
            stack.push({
                name: "comment",
                detail: {data}
            })
        },
        openTag(tagName: string, attributes: Array<Attribute>, selfClosing: boolean) {
            stack.push({
                name: "openTag",
                detail: {tagName, attributes, selfClosing}
            })
        },
        closeTag(tagName: string) {
            stack.push({
                name: "closeTag",
                detail: {tagName}
            })
        }
    })
    return stack
}

describe("parser", function () {
    let i: number
    let el: HTMLDivElement
    beforeEach(() => {
        if (el) {
            el.parentNode?.removeChild(el)
        }
        el = document.body.appendChild(document.createElement("div"))
        i = 0
    })
    it("should parse simple elements", function () {
        const parseResult = executeParse(
            `<div><label>label</label><input></div>`
        )
        // div
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("div")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // label
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("label")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // text
        expect(parseResult[i].name).eq("text")
        expect(parseResult[i].detail.data).eq("label")
        i++
        // label
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("label")
        i++
        // input
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("input")
        expect(parseResult[i].detail.selfClosing).eq(true)
        i++
        // div
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("div")
    })
    it("should parse elements", function () {
        const parseResult = executeParse(
            `<div><h1>title</h1><hr><fieldset><label>label</label><input/></fieldset></div>`
        )
        // div
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // h1
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("h1")
        i++
        // text
        expect(parseResult[i].name).eq("text")
        i++
        // /h1
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("h1")
        i++
        // hr
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("hr")
        i++
        // fieldset
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("fieldset")
        i++
        // label
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("label")
        i++
        // text
        expect(parseResult[i].name).eq("text")
        i++
        // /label
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("label")
        i++
        // input
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("input")
        i++
        // /fieldset
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("fieldset")
        i++
        // /fieldset
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
    });
    it("should handle a bulma panel block", function () {
        const parseResult = executeParse(`<a><small></small></a>`)
        // a
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("a")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // small
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("small")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // small
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("small")
        i++
        // a
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("a")
        i++
    })
    it("should parse bulma card", function () {
        const parseResult = executeParse(`<div id="1"><div id="1.1"><div id="1.1.1">1.1.1</div></div><div id="1.2"><div id="1.2.1">1.2.1</div></div></div>`)
        // div id="1"
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // div id="1.1"
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // div id="1.1.1"
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // text 1.1.1
        expect(parseResult[i].name).eq("text")
        expect(parseResult[i].detail.data).eq("1.1.1")
        i++
        // div id="1.1.1"
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // div id="1.1"
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // div id="1.2"
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // div id="1.2.1"
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // text 1.2.1
        expect(parseResult[i].name).eq("text")
        expect(parseResult[i].detail.data).eq("1.2.1")
        i++
        // div id="1.2.1"
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // div id="1.2"
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("div")
        i++
        // div id="1"
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("div")
    });
    it("should handle custom element", function () {
        const parseResult = executeParse(`<x-a>textA</x-a>`)
        // x-a
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("x-a")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // text
        expect(parseResult[i].name).eq("text")
        expect(parseResult[i].detail.data).eq("textA")
        i++
        // /x-a
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("x-a")
        i++
    })
    it("should handle self closing custom element", function () {
        const parseResult = executeParse(`<x-a><x-b/></x-a>`)
        // x-a
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("x-a")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // text
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("x-b")
        expect(parseResult[i].detail.selfClosing).eq(true)
        i++
        // /x-a
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("x-a")
        i++
    })
    it("should handle self closing elements", function () {
        const parseResult = executeParse(`<x-a><x-b/>textA<x-c>textC</x-c></x-a>`)
        // x-a
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("x-a")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // x-b
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("x-b")
        expect(parseResult[i].detail.selfClosing).eq(true)
        i++
        // text
        expect(parseResult[i].name).eq("text")
        expect(parseResult[i].detail.data).eq("textA")
        i++
        // x-c
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("x-c")
        expect(parseResult[i].detail.selfClosing).eq(false)
        i++
        // text
        expect(parseResult[i].name).eq("text")
        expect(parseResult[i].detail.data).eq("textC")
        i++
        // /x-c
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("x-c")
        i++
        // /x-a
        expect(parseResult[i].name).eq("closeTag")
        expect(parseResult[i].detail.tagName).eq("x-a")
        i++
    })
    it("should parse simple attributes", function () {
        const html = `<div class="classA classB" id="idA" disabled="" required="required" name="name"></div>`
        const attributes = executeParse(html)[0].detail.attributes
        // class="classA classB"
        expect(attributes[i].name).eq("class")
        expect(attributes[i].value).eq("classA classB")
        i++
        // id="idA"
        expect(attributes[i].name).eq("id")
        expect(attributes[i].value).eq("idA")
        i++
        // disabled=""
        expect(attributes[i].name).eq("disabled")
        expect(attributes[i].value).eq("")
        i++
        // required="required"
        expect(attributes[i].name).eq("required")
        expect(attributes[i].value).eq("required")
        i++
        // name="name"
        expect(attributes[i].name).eq("name")
        expect(attributes[i].value).eq("name")
        i++
    })
    it("should parse special attributes", function () {
        const html = `<div class="classA classB" id=idA o:key='keyA' required="" disabled="disabled" o:skip></div>`
        const attributes = executeParse(html)[0].detail.attributes
        // class="classA classB"
        expect(attributes[i].name).eq("class")
        expect(attributes[i].value).eq("classA classB")
        i++
        // id=idA
        expect(attributes[i].name).eq("id")
        expect(attributes[i].value).eq("idA")
        i++
        // o:key
        expect(attributes[i].name).eq("o:key")
        expect(attributes[i].value).eq("keyA")
        i++
        // required=""
        expect(attributes[i].name).eq("required")
        expect(attributes[i].value).eq("")
        i++
        // disabled="disabled"
        expect(attributes[i].name).eq("disabled")
        expect(attributes[i].value).eq("disabled")
        i++
        // o:skip
        expect(attributes[i].name).eq("o:skip")
        expect(attributes[i].value).eq("")
        i++
    })
    it("should parse attributes", function () {
        const html = `<input type="number" disabled value="1" />`
        const parseResult = executeParse(html)
        // input
        expect(parseResult[i].name).eq("openTag")
        expect(parseResult[i].detail.tagName).eq("input")
        expect(parseResult[i].detail.attributes[0].name).eq("type")
        expect(parseResult[i].detail.attributes[0].value).eq("number")
        expect(parseResult[i].detail.attributes[1].name).eq("disabled")
        expect(parseResult[i].detail.attributes[1].value).eq("")
        expect(parseResult[i].detail.attributes[2].name).eq("value")
        expect(parseResult[i].detail.attributes[2].value).eq("1")
        expect(parseResult[i].detail.selfClosing).eq(true)
    })
})
