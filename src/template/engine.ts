/**
 * @private
 */
export type ContextItem = Element & HTMLElement & DocumentFragment & {
    /**
     * C.f. {@link Engine.PROP_NAME_PRESERVE_ATTRIBUTES}
     */
    __ceb_engine_preserve_attributes?: Array<string>
    /**
     * C.f. {@link Engine.PROP_NAME_PRESERVE_CHILDREN}
     */
    __ceb_engine_preserve_children?: boolean
    /**
     * The value refers to a property name which is only used internally.
     * @private
     */
    __ceb_engine_updated_properties?: Array<string>
    /**
     * The value refers to a property name which is only used internally.
     * @private
     */
    __ceb_engine_slot?: ContextItem
    /**
     * The value refers to a property name which is only used internally.
     * @private
     */
    [key: string]: any
}

/**
 * The map of attributes.
 */
export type Attributes = Array<[string, string | number | boolean]>
/**
 * The map of properties.
 */
export type Properties = Array<[string, any]>
/**
 * The map of options.
 */
export type Options = {
    /**
     * When true, the current element will be skipped.
     */
    skip?: boolean
    /**
     * When true, the current element will be skipped and will be the "slot" location of the container element.
     */
    slot?: boolean
    /**
     * Associate a key to the current element in order to re-use it iteration after iteration.
     */
    key?: any
}
/**
 * The parameters.
 */
export type Parameters = {
    attributes?: Attributes
    properties?: Properties
    options?: Options
}
/**
 * The render function is used to orchestrate the update operations.
 */
export type RenderFunction = (engine: Engine) => void

type NodeFactory = (document: Document, text?: string) => Node

function sanitize(value?: string | number | boolean): string {
    return value === undefined || value === null ? '' : value.toString()
}

class Context {
    constructor(
        public readonly _element: ContextItem | null,
        private index: number = -1
    ) {
    }

    get isManaged() {
        return !!this._element
    }

    get element(): ContextItem {
        if (!this._element) {
            throw new Error("the context has no element")
        }
        return this._element
    }

    nextIndex() {
        this.index = this.index + 1
        return this.index
    }

    lastIndex() {
        return this.index + 1
    }
}

class Contexts {
    constructor(
        private readonly element: ContextItem,
        private readonly stack: Array<Context> = [new Context(element)]
    ) {
    }

    start(element: ContextItem | null): void {
        this.stack.unshift(new Context(element))
    }

    stop() {
        this.stack.shift()
    }

    get(): Context {
        return this.stack[0]
    }
}

function createDefaultParams(): Parameters {
    return {
        attributes: [],
        properties: [],
        options: {
            skip: false,
            slot: false,
            key: undefined,
        },
    }
}

function createTextNode(document: Document, text?: string): Node {
    return document.createTextNode(sanitize(text))
}

function createCommentNode(document: Document, text?: string): Node {
    return document.createComment(sanitize(text))
}

function createElement(document: Document, name: string, attrs: Attributes = []): ContextItem {
    const isIndex = attrs.findIndex(([key]) => key === "is")
    return isIndex > -1
        ? document.createElement(name, {is: attrs[isIndex][1] as string}) as ContextItem
        : document.createElement(name) as ContextItem
}

function removeRemainingNodes(contexts: Contexts) {
    if (contexts.get().isManaged) {
        const parentElement = contexts.get().element
        if (parentElement.__ceb_engine_slot !== parentElement) {
            const lastIndex = contexts.get().lastIndex()
            if (lastIndex > -1) {
                while (parentElement.childNodes.length > lastIndex) {
                    if (parentElement.lastChild) {
                        parentElement.removeChild(parentElement.lastChild)
                    }
                }
            }
        }
    }
}

function updateAttributes(element: ContextItem, attributes: Attributes = []) {
    const preservedAttributes: Array<string> = element.__ceb_engine_preserve_attributes || []
    const updatedAttributes: Array<string> = []
    for (const entry of attributes) {
        const name = entry[0]
        if (preservedAttributes.indexOf(name) < 0) {
            const value = entry[1]
            const type = typeof value
            if (type === "boolean") {
                if (value) {
                    element.setAttribute(name, "")
                    updatedAttributes.push(name)
                } else {
                    element.removeAttribute(name)
                }
            } else {
                element.setAttribute(name, sanitize(value))
                updatedAttributes.push(name)
            }
        }
    }
    Array.from(element.attributes)
        .filter((attr) => updatedAttributes.indexOf(attr.name) < 0)
        .filter((attr) => preservedAttributes.indexOf(attr.name) < 0)
        .forEach((attr) => element.removeAttribute(attr.name))
}

function updateProperties(element: ContextItem, properties: Properties = []) {
    const updatedProperties: Array<string> = []
    for (const entry of properties) {
        const name = entry[0]
        element[name] = entry[1]
        updatedProperties.push(name)
    }
    (element.__ceb_engine_updated_properties || [])
        .filter((attr: string) => updatedProperties.indexOf(attr) < 0)
        .forEach((name: string) => element[name] = undefined)
    element.__ceb_engine_updated_properties = updatedProperties
}

const REFERENCED_ELEMENTS = new WeakMap<ContextItem, Map<any, ContextItem>>()

function isReferencedElement(parentElement: ContextItem, value: any): boolean {
    if (!REFERENCED_ELEMENTS.has(parentElement)) {
        REFERENCED_ELEMENTS.set(parentElement, new Map<any, ContextItem>())
    }
    return Array.from(
        REFERENCED_ELEMENTS.get(parentElement)?.values() || []
    ).indexOf(value) > -1
}

function getReferencedElement(parentElement: ContextItem, key: any): ContextItem | undefined {
    if (!REFERENCED_ELEMENTS.has(parentElement)) {
        REFERENCED_ELEMENTS.set(parentElement, new Map<any, ContextItem>())
    }
    if (REFERENCED_ELEMENTS.get(parentElement)?.has(key)) {
        return REFERENCED_ELEMENTS.get(parentElement)?.get(key)
    }
}

function setReferencedElement(parentElement: ContextItem, key: any, element: ContextItem): void {
    if (key) {
        if (!REFERENCED_ELEMENTS.has(parentElement)) {
            REFERENCED_ELEMENTS.set(parentElement, new Map<any, ContextItem>())
        }
        REFERENCED_ELEMENTS.get(parentElement)?.set(key, element)
    }
}

function cleanReferencedElements(contexts: Contexts) {
    if (contexts.get().isManaged) {
        const element = contexts.get().element
        if (REFERENCED_ELEMENTS.has(element)) {
            // clean referenced elements not handled by the element
            // clean the list of referenced elements
            for (const [key, value] of [...REFERENCED_ELEMENTS?.get(element)?.entries() ?? []]) {
                if (!element.contains(value)) {
                    REFERENCED_ELEMENTS.get(element)?.delete(key)
                }
            }
        }
    }
}

/**
 * An engine manages the update of DOM elements.
 *
 * The updates are managed by atomic operations:
 *
 * - open and close an element (i.e. an element with potentially some content like `p`)
 * - add void element (i.e. an element without content like `input`)
 * - write a text
 * - write a comment
 *
 * Once an element is opened, then all subsequent operations impact its direct descendants til it's closure.
 *
 * @example Define a simple text node in an `p` element
 * ```typescript
 * Engine.updateElement(el, (engine) => {
 *   engine.openElement("p")
 *   engine.text("hello")
 *   engine.closeElement()
 * })
 * ```
 * @example Define a input handling only positive numbers
 * ```typescript
 * Engine.updateElement(el, (engine) => {
 *   engine.voidElement("input", {
 *     attributes: [
 *       ["type", "number"],
 *       ["min", "0"],
 *     ]
 *   })
 * })
 * ```
 */
export class Engine {
    /**
     * The value refers to a property name which should be used by Custom Element only.
     * The purpose of the property is to list attribute names which won't be mutated.
     * @example Preserve the type and min of an extended input
     * ```typescript
     * class OnlyPositiveNumberInput extends HTMLInputElement {
     *   __ceb_engine_preserve_attributes = ["type", "min"]
     *   constructor() {
     *     super()
     *     this.type = "number"
     *     this.min = "0"
     *   }
     * }
     * ```
     */
    static readonly PROP_NAME_PRESERVE_ATTRIBUTES = "__ceb_engine_preserve_attributes"
    /**
     * The value refers to a property name which should be used by Custom Element only.
     * The purpose of the property is to prevent the mutation of the child nodes.
     * @example Preserve the child nodes of Custom Element
     * ```typescript
     * class SimpleCustomElement extends HTMLElement {
     *   __ceb_engine_preserve_children = true
     *   constructor() {
     *     super()
     *   }
     *   connectedCallback() {
     *     this.textContent = "an initial text content"
     *   }
     * }
     * ```
     */
    static readonly PROP_NAME_PRESERVE_CHILDREN = "__ceb_engine_preserve_children"

    private constructor(
        private readonly containerElement: ContextItem,
        private readonly contexts: Contexts = new Contexts(containerElement),
        private readonly document: Document = containerElement.ownerDocument,
    ) {
    }

    /**
     * Update the given HTML element and the underlying descendants.
     * The operations orchestrating the updates are driven by a given function.
     * @param destination the destination of the update
     * @param render the function expressing the update operations
     * @param parameter parameters of the Update Element process
     */
    static update(destination: Element | DocumentFragment, render: RenderFunction, parameter?: UpdateParameters) {
        const container = destination as ContextItem
        let lightFrag = null
        if (parameter?.greyDom) {
            if (!container.__ceb_engine_slot) {
                lightFrag = container.ownerDocument.createDocumentFragment()
                while (container.childNodes.length > 0) {
                    if (container.firstChild) {
                        lightFrag.appendChild(container.removeChild(container.firstChild))
                    }
                }
                container.__ceb_engine_slot = container
            }
        }

        // `as Element` is fine because DocumentFragment can only be a container
        const contexts = new Contexts(container)
        const engine = new Engine(container, contexts)

        render(engine)
        removeRemainingNodes(contexts)

        if (lightFrag) {
            let slotElement = container.__ceb_engine_slot
            if (slotElement !== container) {
                while (slotElement?.__ceb_engine_slot) {
                    slotElement = slotElement.__ceb_engine_slot
                }
            }
            slotElement?.appendChild(lightFrag)
        }
    }

    /**
     * Open an HTML element.
     * @param name the tag name of the element
     * @param parameters optional attributes, properties and additional options
     */
    openElement(name: string, parameters?: Parameters): void {
        const element = this.handleElement(name, parameters)
        if (parameters?.options?.slot) {
            this.containerElement.__ceb_engine_slot = element
        }
        if (parameters?.options?.slot || parameters?.options?.skip || element.__ceb_engine_preserve_children) {
            this.contexts.start(null)
        } else {
            this.contexts.start(element)
        }
    }

    /**
     * Close the current opened HTML element.
     */
    closeElement(): void {
        removeRemainingNodes(this.contexts)
        cleanReferencedElements(this.contexts)
        this.contexts.stop()
    }

    /**
     * Open a "void" HTML element like the `input` element.
     * @param name the tag name of the element
     * @param parameters optional attributes, properties and additional options
     */
    voidElement(name: string, parameters?: Parameters): void {
        this.handleElement(name, parameters)
    }

    /**
     * Append a slot element.
     */
    slot(): void {
        this.containerElement.__ceb_engine_slot = this.handleElement("ceb-slot", {
            options: {
                skip: true
            }
        })
    }

    /**
     * Define a comment node.
     * @param text the value of the comment node
     */
    comment(text?: string): void {
        if (text) {
            this.handleNode(
                text,
                this.document.COMMENT_NODE,
                createCommentNode
            )
        }
    }

    /**
     * Define a text node.
     * @param text the value of the text node
     */
    text(text?: string): void {
        if (text) {
            this.handleNode(
                text,
                this.document.TEXT_NODE,
                createTextNode
            )
        }
    }

    private handleNode(value: string, nodeType: number, createNode: NodeFactory): void {
        const parentElement = this.contexts.get().element
        const index = this.contexts.get().nextIndex()

        let currentNode = parentElement.childNodes.item(index)
        if (currentNode) {
            if (currentNode.nodeType !== nodeType) {
                parentElement.insertBefore(createNode(this.document, value), currentNode)
            } else {
                currentNode.nodeValue = value
            }
        } else {
            parentElement.appendChild(createNode(this.document, value))
        }
    }

    private handleElement(name: string, parameters: Parameters = createDefaultParams()): ContextItem {
        const parentElement = this.contexts.get().element
        const index = this.contexts.get().nextIndex()

        const key = parameters?.options?.key
        let referencedElement = getReferencedElement(parentElement, key)

        const currentNode = parentElement.childNodes.item(index)
        const currentNodeIsReferenced = isReferencedElement(parentElement, currentNode)

        let currentElement: ContextItem
        if (referencedElement) {
            // the new item already exists in the DOM
            currentElement = referencedElement
            if (currentNode !== referencedElement) {
                // but the current DOM node is not right one
                // therefore the node of the new item is moved before the current one
                currentElement = parentElement.insertBefore(referencedElement, currentNode);
            }
        } else if (currentNode) {
            // the new item doesn't exist in the DOM
            if (currentNodeIsReferenced) {
                // but the current one is a referenced element
                // so it must not be mutated
                // so the node of the new item is created and appended before the referenced element
                currentElement = parentElement.insertBefore(
                    createElement(this.document, name, parameters.attributes),
                    currentNode
                )
            } else {
                // and the current node is not a referenced element
                if (currentNode instanceof Element) {
                    // the current node is an element (i.e. not a text or a comment node)
                    // in that case, by default, the node of new item is the current node ...
                    currentElement = currentNode as ContextItem
                    const currentTagName = currentElement.tagName.toLowerCase()
                    const tagName = name.toLowerCase()
                    if (currentTagName.localeCompare(tagName) !== 0) {
                        // ... unless the type doesn't match
                        // so the node of the new item is created and appended before the current node
                        currentElement = parentElement.insertBefore(
                            createElement(this.document, name, parameters.attributes),
                            currentNode
                        )
                    }
                } else {
                    // the current node is not an element
                    // so the node of the new item is created and appended before the current node
                    currentElement = parentElement.insertBefore(
                        createElement(this.document, name, parameters.attributes),
                        currentNode
                    )
                }
            }
        } else {
            // there is no current node, i.e. the parent element doesn't have any children
            // so the node of the new item is created and appended to the parent element
            currentElement = this.contexts.get().element.appendChild(
                createElement(this.document, name, parameters.attributes)
            )
        }

        setReferencedElement(parentElement, key, currentElement)
        updateAttributes(currentElement, parameters.attributes)
        updateProperties(currentElement, parameters.properties)

        return currentElement
    }

}

/**
 * Parameters of the update process.
 */
export type UpdateParameters = {
    /**
     * When true, the Grey DOM feature is handled.
     * That means at the creation of the element, the children discovered from the Light DOM will moved to the found slot element.
     * Somehow it create a Grey DOM lying between the Light DOM and the Shadow DOM.
     */
    greyDom?: boolean
}
