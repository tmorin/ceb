// based on HTML Parser By John Resig (ejohn.org)
// https://johnresig.com/files/htmlparser.js

function toMap(str: string) {
    const obj: any = {}
    const items = str.split(",")
    for (let i = 0; i < items.length; i++) {
        obj[items[i]] = true
    }
    return obj
}

// Regular Expressions for parsing tags and attributes
const startTag = /^<([-:A-Za-z0-9_]+)((?:\s+[\w:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
const endTag = /^<\/([-:A-Za-z0-9_]+)[^>]*>/
const attr = /([-:A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g

// 2021-07-26 - https://developer.mozilla.org/en-US/docs/Glossary/empty_element
const empty = toMap("area,base,br,col,embed,hr,img,input,keygen,link,meta,param,source,track,wbr")

// 2021-07-26 - https://developer.mozilla.org/en-US/docs/Glossary/empty_element
const inline = toMap("a,abbr,acronym,b,bdi,bdo,big,br,button,canvas,cite,code,data,datalist,del,dfn,em,embed,i,iframe,img,input,ins,kbd,label,map,mark,meter,noscript,object,output,picture,progress,q,ruby,s,samp,script,select,slot,small,span,strong,sub,sup,svg,template,textarea,time,u,tt,var,video,wbr")

// Special Elements (can contain anything)
const special = toMap("script,style")

export type SaxHandler = {
    openTag?(name: string, attributes: Array<Attribute>, selfClosing: boolean): void
    closeTag?(name: string): void
    comment?(data: string): void
    text?(data: string): void
}

export type Attribute = {
    name: string
    value: string
}

type Stack = Array<string> & {
    last: () => string
}

function createStack(): Stack {
    const array: Array<string> = []
    return Object.assign(array, {
        last: () => array[array.length - 1]
    })
}

export function parse(html: string, handler: SaxHandler) {
    let index: number
    let chars: boolean
    let match
    let stack = createStack()
    let last = html

    while (html) {
        chars = true

        // Make sure we're not in a script or style element
        if (!stack["last"]() || !special[stack["last"]()]) {

            // Comment
            if (html.indexOf("<!--") == 0) {
                index = html.indexOf("-->")
                if (index >= 0) {
                    if (handler.comment)
                        handler.comment(html.substring(4, index))
                    html = html.substring(index + 3)
                    chars = false
                }
                // end tag
            } else if (html.indexOf("</") == 0) {
                match = html.match(endTag)
                if (match) {
                    html = html.substring(match[0].length)
                    match[0].replace(endTag, parseEndTag)
                    chars = false
                }
                // start tag
            } else if (html.indexOf("<") == 0) {
                match = html.match(startTag)
                if (match) {
                    html = html.substring(match[0].length)
                    match[0].replace(startTag, parseStartTag)
                    chars = false
                }
            }

            if (chars) {
                index = html.indexOf("<")
                const text = index < 0 ? html : html.substring(0, index)
                html = index < 0 ? "" : html.substring(index)
                if (handler.text) {
                    handler.text(text)
                }
            }

        } else {
            html = html.replace(new RegExp("(.*)<\/" + stack["last"]() + "[^>]*>"), function (all, text) {
                text = text.replace(/<!--(.*?)-->/g, "$1").replace(/<!\[CDATA\[(.*?)]]>/g, "$1")
                if (handler.text) {
                    handler.text(text)
                }
                return ""
            })
            parseEndTag("", stack["last"]())
        }

        if (html == last) {
            throw "Parse Error: " + html
        }
        last = html
    }

    // Clean up any remaining tags
    parseEndTag()

    function parseStartTag(tag: string, tagName: string, rest: string, selfClosing: boolean) {
        tagName = tagName.toLowerCase()

        if (!empty[tagName] && !selfClosing) {
            while (stack["last"]() && inline[stack["last"]()]) {
                parseEndTag("", stack["last"]())
            }
        }

        if (stack["last"]() == tagName) {
            parseEndTag("", tagName)
        }

        selfClosing = empty[tagName] || !!selfClosing

        if (!selfClosing) {
            stack.push(tagName)
        }

        if (handler.openTag) {
            const attrs: Array<Attribute> = []
            rest.replace(attr, function (match, name) {
                const value = arguments[2]
                    ? arguments[2]
                    : arguments[3]
                        ? arguments[3]
                        : arguments[4]
                            ? arguments[4]
                            : ""
                attrs.push({
                    name: name,
                    value: value,
                })
                return ""
            })

            if (handler.openTag)
                handler.openTag(tagName, attrs, selfClosing)
        }

        return ""
    }

    function parseEndTag(tag?: string, tagName?: string) {
        let pos: number

        if (!tagName) {
            // If no tag name is provided, clean shop
            pos = 0
        } else {
            // Find the closest opened tag of the same type
            for (pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos] == tagName) {
                    break
                }
            }
        }

        if (pos >= 0) {
            // Close all the open elements, up the stack
            for (let i = stack.length - 1; i >= pos; i--) {
                if (handler.closeTag) {
                    handler.closeTag(stack[i])
                }
            }

            // Remove the open elements from the stack
            stack.length = pos
        }

        return ""
    }
}
