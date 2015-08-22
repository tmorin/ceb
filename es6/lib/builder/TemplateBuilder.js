import isFunction from 'lodash/lang/isFunction.js';
import isString from 'lodash/lang/isString.js';

import Builder from './Builder.js';
import property from './PropertyBuilder.js';

/**
 * The counter is used to generate unique DOM's id.
 * @type {number}
 */
var counter = 0;

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
        .replace('<content></content>', '<span ceb-content></span>')
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
 * @returns {Array<Node>} the children DOM nodes
 */
function cleanOldContentNode(el) {
    let oldContentNode = el.lightDomNode,
        lightChildren = [];
    while (oldContentNode.childNodes.length > 0) {
        lightChildren.push(oldContentNode.removeChild(oldContentNode.childNodes[0]));
    }
    return lightChildren;
}

/**
 * Add the given DOM nodes list to the given element.
 * @param {!HTMLElement} el the custom element
 * @param {Array<Node>} children the children DOM nodes
 */
function fillNewContentNode(el, children) {
    let newContentNode = el.lightDomNode;
    children.forEach(function (child) {
        newContentNode.appendChild(child);
    });
}

/**
 * The template builder.
 * Its goal is to provide a way to fill the content of a custom element.
 * @extends {Builder}
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
     * @ignore
     */
    build(proto, on) {
        let data = this.data,
            html = isString(data.tpl) ? data.tpl : null;

        property('lightDomNode').getter(el => {
            return findContentNode(el);
        }).build(proto, on);

        on('before:createdCallback').invoke(el => {
            let tpl = html;
            if (isFunction(data.tpl)) {
                tpl = data.tpl(el);
            }

            let lightChildren = [],
                handleContentNode = hasContent(tpl);

            if (handleContentNode) {
                let newCebContentId = 'ceb-content-' + counter++;
                lightChildren = cleanOldContentNode(el);

                tpl = replaceContent(tpl, newCebContentId);

                el.setAttribute(OLD_CONTENT_ID_ATTR_NAME, newCebContentId);
            }

            el.innerHTML = tpl;

            if (handleContentNode) {
                fillNewContentNode(el, lightChildren);
            }

        });
    }

}

/**
 * @ignore
 */
export default function helper(tpl) {
    return new TemplateBuilder(tpl);
}

