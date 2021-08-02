import {Attributes, Engine, Options, Parameters, Properties, UpdateParameters} from "./engine"
import {Attribute, parse} from "./parser"
import {Template, TemplateParameters} from "./builder";
import {toCamelCase} from "../utilities";

export {UpdateParameters} from "./engine"

const PATTERN_CEB_VALUE_INDEX = /{{ceb_value_index:([0-9]+)}}/gm
const PREFIX_CEB_VALUE_INDEX = "{{ceb_value_index:"
const SUFFIX_CEB_VALUE_INDEX = "}}"
const PREFIX_CEB_PROPERTY = "p:"
const PREFIX_CEB_OPTION = "o:"
const PROTECTED_TAGS = ["slot", "ceb-slot"]

function fromStringToValues(string: string = "", args: Array<any> = []): Array<any> {
    const values: Array<any> = []
    const r = new RegExp(PATTERN_CEB_VALUE_INDEX)
    let cursorFrom = 0
    let cursorTo = 0
    let match
    while (match = r.exec(string)) {
        cursorTo = match.index
        const textValue = string.substring(cursorFrom, cursorTo)
        if (textValue) {
            values.push(textValue)
        }
        const argIndex = match[1]
        const argValue = args[parseInt(argIndex)]
        values.push(argValue)
        cursorFrom = cursorTo + match[0].length
    }
    const finalTextValue = string.substring(cursorFrom)
    if (finalTextValue) {
        values.push(finalTextValue)
    }
    return values
}

function fromValuesToOperations(values: Array<any>, accumulator: (operations: Operations, value: any) => void): Operations {
    const operations = new Operations()
    values.forEach(value => {
        if (value instanceof Operations) {
            operations.push(value)
        } else if (Array.isArray(value)) {
            for (let item of value) {
                if (item instanceof Operations) {
                    operations.push(item)
                } else {
                    accumulator(operations, item)
                }
            }
        } else {
            accumulator(operations, value)
        }
    })
    return operations
}

function generateParameters(tagAttrs: Array<Attribute> = [], args: Array<any>): Parameters {
    const attributes: Attributes = []
    const properties: Properties = []
    const options: Options = {}
    tagAttrs.forEach(({name: attrName, value: attrValue}) => {
        const values = fromStringToValues(attrValue, args)
        const value = values.length === 1 ? values[0] : values.join("")
        const isProperty = attrName.startsWith(PREFIX_CEB_PROPERTY)
        const isOption = attrName.startsWith(PREFIX_CEB_OPTION)
        if (isProperty) {
            const propName = toCamelCase(attrName.replace(PREFIX_CEB_PROPERTY, ""))
            if (propName) {
                properties.push([propName, value])
            }
        } else if (isOption) {
            const optName = toCamelCase(attrName.replace(PREFIX_CEB_OPTION, ""))
            if (optName) {
                Object.assign(options, {
                    [optName]: value === "" || value === attrName ? true : value
                })
            }
        } else {
            const sanitizedAttrValue = value === attrName ? "" : value
            attributes.push([attrName, sanitizedAttrValue])
        }
    })
    return {attributes, properties, options}
}

type Operation = (engine: Engine) => void

class Operations implements Template<UpdateParameters> {
    constructor(
        private readonly operations: Array<Operation> = []
    ) {
    }

    push(value: Operations | Operation) {
        if (value instanceof Operations) {
            value.operations.forEach(o => this.operations.push(o))
        } else {
            this.operations.push(value)
        }
    }

    render(destination: DocumentFragment | Element, parameters?: TemplateParameters & UpdateParameters) {
        Engine.update(destination, engine => {
            this.operations.forEach(operation => operation(engine))
        }, Object.assign({greyDom: parameters?.greyDom}, parameters))
    }
}

const stringsCaches = new WeakMap<TemplateStringsArray, string>()

/**
 * This function is a [tag function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)
 * which converts a [literal statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literal) to a {@link Template}.
 * The template can then be used to update the DOM.
 *
 * @example Render a simple greeting
 * ```typescript
 * import {html, Template} from 'ceb'
 * const name = "World"
 * const template : Template = html`<p>Hello, ${name}!</p>`
 * template.render(document.body)
 * ```
 *
 * @param strings the strings
 * @param args the arguments
 */
export function html(strings: TemplateStringsArray, ...args: Array<any>): Template<UpdateParameters> {
    if (!stringsCaches.has(strings)) {
        stringsCaches.set(strings, strings.map(
            (text, index) =>
                `${text}${typeof args[index] !== "undefined" ? `${PREFIX_CEB_VALUE_INDEX}${index}${SUFFIX_CEB_VALUE_INDEX}` : ""}`
        ).join(""))
    }

    const operations = new Operations()
    parse(stringsCaches.get(strings) || "", {
        openTag(name: string, attrs: Array<Attribute>, selfClosing: boolean) {
            const parameters = generateParameters(attrs, args)
            if (PROTECTED_TAGS.indexOf(name) > -1) {
                Object.assign(parameters.options, {
                    slot: true
                })
            }
            operations.push(engine => engine.openElement(name, parameters))
            if (selfClosing) {
                operations.push(engine => engine.closeElement())
            }
        },
        closeTag() {
            operations.push(engine => engine.closeElement())
        },
        text(data: string) {
            const values = fromStringToValues(data, args)
            operations.push(fromValuesToOperations(
                values,
                (childOperations, value) => childOperations.push(engine => engine.text(value))
            ))
        },
        comment(data: string) {
            const values = fromStringToValues(data, args)
            operations.push(fromValuesToOperations(
                values,
                (childOperations, value) => childOperations.push(engine => engine.comment(value))
            ))
        }
    })
    return operations
}
