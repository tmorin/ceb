import {isFunction} from '../helper/types.js';
import {property} from './property.js';
import Builder from './Builder';

/**
 * The counter is used to generate unique DOM's id.
 * @type {number}
 */
let counter = 0;

/**
 * The attribute name hosting the old light node id.
 * @type {string}
 */
const OLD_CONTENT_ID_ATTR_NAME = 'ceb-old-content-id';

/**
 * Regex to detect the *ceb-content* attributes.
 * @type {RegExp}
 */
const CONTENT_ATTR_REG_EX = /ceb\-content/im;

/**
 * Regex to detect the *content* element.
 * @type {RegExp}
 */
const CONTENT_NODE_REG_EX = /<content><\/content>/im;

/**
 * @param {!string} html the HTML template
 * @returns {boolean} true if the HTML template handle a light DOM node
 */
function hasContent(html) {
    return html.search(CONTENT_ATTR_REG_EX) !== -1 || html.search(CONTENT_NODE_REG_EX) !== -1;
}

/**
 * Update or replace an eventual content flag according to the given id.
 * @param {!string} html the HTML template
 * @param {!string} newCebContentId the new content node id
 * @returns {string} the updated HTML template
 */
function replaceContent(html, newCebContentId) {
    return html
        .replace('<content></content>', '<ceb-lightdom ceb-content></ceb-lightdom>')
        .replace('ceb-content', newCebContentId);
}

/**
 * Try to find a light DOM node
 * @param {!HTMLElement} el the custom element
 * @returns {HTMLElement} the light DOM node if found otherwise it's the given HTML Element
 */
function findContentNode(el) {
    if (!el) {
        return;
    }
    let oldCebContentId = el.getAttribute(OLD_CONTENT_ID_ATTR_NAME);
    if (oldCebContentId) {
        return findContentNode(el.querySelector('[' + oldCebContentId + ']')) || el;
    }
    return el;
}

/**
 * Remove and return the children of the light DOM node.
 * @param {!HTMLElement} el the custom element
 * @returns {DocumentFragment} the light DOM fragment
 */
function cleanOldContentNode(el) {
    let oldContentNode = el.lightDOM,
        lightFrag = document.createDocumentFragment();
    while (oldContentNode.childNodes.length > 0) {
        lightFrag.appendChild(oldContentNode.removeChild(oldContentNode.childNodes[0]));
    }
    return lightFrag;
}

/**
 * Apply the template to the element.
 * @param {!HTMLElement} el the custom element
 * @param {!string} tpl the template
 */
export function applyTemplate(el, tpl) {
    let lightFrag, handleContentNode = hasContent(tpl);

    if (handleContentNode) {
        let newCebContentId = 'ceb-content-' + counter++;
        lightFrag = cleanOldContentNode(el);

        tpl = replaceContent(tpl, newCebContentId);

        el.setAttribute(OLD_CONTENT_ID_ATTR_NAME, newCebContentId);
    }

    el.innerHTML = tpl;

    if (handleContentNode && lightFrag) {
        el.lightDOM.appendChild(lightFrag);
    }
}

/**
 * The template builder.
 * Its goal is to provide a way to fill the content of a custom element.
 */
export class TemplateBuilder extends Builder {

    /**
     * @param {!string|function(el: HTMLElement)} tpl the template as a string or a function
     */
    constructor(tpl) {
        super();
        /**
         * @ignore
         */
        this.data = {tpl};
    }

    /**
     * Logic of the builder.
     * @param {!ElementBuilder.context.p} proto the prototype
     * @param {!ElementBuilder.on} on the method on
     */
    build(proto, on) {
        let data = this.data;

        property('lightDOM').getter(el => findContentNode(el)).build(proto, on);

        on('before:createdCallback').invoke(el => {
            applyTemplate(el, isFunction(data.tpl) ? data.tpl(el) : data.tpl);
        });
    }

}

/**
 * Get a new template builder.
 * @param {!string|function} tpl the string or function template
 * @returns {TemplateBuilder} the template builder
 */
export function template(tpl) {
    return new TemplateBuilder(tpl);
}
