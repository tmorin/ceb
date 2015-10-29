System.register(['../utils.js', './Builder.js', './PropertyBuilder.js'], function (_export) {

    /**
     * The counter is used to generate unique DOM's id.
     * @type {number}
     */
    'use strict';

    var isFunction, Builder, PropertyBuilder, counter, OLD_CONTENT_ID_ATTR_NAME, CONTENT_ATTR_REG_EX, CONTENT_NODE_REG_EX, TemplateBuilder;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    /**
     * The template builder.
     * Its goal is to provide a way to fill the content of a custom element.
     * @extends {Builder}
     */

    _export('applyTemplate', applyTemplate);

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        return html.replace('<content></content>', '<ceb-lightdom ceb-content></ceb-lightdom>').replace('ceb-content', newCebContentId);
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
        var oldCebContentId = el.getAttribute(OLD_CONTENT_ID_ATTR_NAME);
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
        var oldContentNode = el.lightDom,
            lightFrag = document.createDocumentFragment();
        while (oldContentNode.childNodes.length > 0) {
            lightFrag.appendChild(oldContentNode.removeChild(oldContentNode.childNodes[0]));
        }
        return lightFrag;
    }

    /**
     * Add the given DOM nodes list to the given element.
     * @param {!HTMLElement} el the custom element
     * @param {DocumentFragment} lightFrag the light DOM fragment
     */
    function fillNewContentNode(el, lightFrag) {
        el.lightDom.appendChild(lightFrag);
    }

    /**
     * Apply the template given by the property cebTemplate.
     * @param {!HTMLElement} el the custom element
     * @param {!string} tpl the template
     */

    function applyTemplate(el, tpl) {
        var lightFrag = [],
            handleContentNode = hasContent(tpl);

        if (handleContentNode) {
            var newCebContentId = 'ceb-content-' + counter++;
            lightFrag = cleanOldContentNode(el);

            tpl = replaceContent(tpl, newCebContentId);

            el.setAttribute(OLD_CONTENT_ID_ATTR_NAME, newCebContentId);
        }

        el.innerHTML = tpl;

        if (handleContentNode) {
            fillNewContentNode(el, lightFrag);
        }
    }

    return {
        setters: [function (_utilsJs) {
            isFunction = _utilsJs.isFunction;
        }, function (_BuilderJs) {
            Builder = _BuilderJs.Builder;
        }, function (_PropertyBuilderJs) {
            PropertyBuilder = _PropertyBuilderJs.PropertyBuilder;
        }],
        execute: function () {
            counter = 0;

            /**
             * The attribute name hosting the old light node id.
             * @type {string}
             */
            OLD_CONTENT_ID_ATTR_NAME = 'ceb-old-content-id';

            /**
             * Regex to detect the *ceb-content* attributes.
             * @type {RegExp}
             */
            CONTENT_ATTR_REG_EX = /ceb\-content/im;

            /**
             * Regex to detect the *content* element.
             * @type {RegExp}
             */
            CONTENT_NODE_REG_EX = /<content><\/content>/im;

            TemplateBuilder = (function (_Builder) {
                _inherits(TemplateBuilder, _Builder);

                /**
                 * @param {!string|function(el: HTMLElement)} tpl the template as a string or a function
                 */

                function TemplateBuilder(tpl) {
                    _classCallCheck(this, TemplateBuilder);

                    _get(Object.getPrototypeOf(TemplateBuilder.prototype), 'constructor', this).call(this);
                    /**
                     * @ignore
                     */
                    this.data = { tpl: tpl };
                }

                /**
                 * @ignore
                 */

                _createClass(TemplateBuilder, [{
                    key: 'build',
                    value: function build(proto, on) {
                        var data = this.data;

                        new PropertyBuilder('lightDom').getter(function (el) {
                            return findContentNode(el);
                        }).build(proto, on);

                        on('before:createdCallback').invoke(function (el) {
                            applyTemplate(el, isFunction(data.tpl) ? data.tpl(el) : data.tpl);
                        });
                    }
                }]);

                return TemplateBuilder;
            })(Builder);

            _export('TemplateBuilder', TemplateBuilder);
        }
    };
});