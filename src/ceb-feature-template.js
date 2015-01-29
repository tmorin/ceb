// # ceb-feature-template.js

// ## Light DOM
//
// The template can contains a node having the attribute `ceb-content`.
// The marked node is intend to host the light DOM of the current element at the end of the templating process.
//
// If the template doesn't contain this node, the light DOM will be lost.
//
// ## DOM nodes references
//
// The template can contains nodes having the attribute `ceb-ref`.
// The marked nodes will be available at the end of the templating process from the feature function (`feature(el)`).
//
// That means, if a node has the attribute `ceb-ref="header"`.
// It will be available via `feature(el).header`.

(function (g, factory) {
    'use strict';

    /* istanbul ignore next */
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define('ceb-feature-template', [], factory);
    } else {
        g.cebFeatureTemplate = factory();
    }

}(this, function () {
    'use strict';

    // ## feature function

    // The template feature's function returns the nodes' reference of the template.
    function feature(el) {
        if (!el.__cebTemplateScope) {
            el.__cebTemplateScope = {};
        }
        return el.__cebTemplateScope;
    }

    // ## Templating stuff

    // The counter is used to generate unique DOM's id.
    var counter = 0;

    // Regex to detect the *ceb-ref* attributes
    var nodesRegEx = /ceb\-ref=\W*(\w*)/igm;

    // Regex to detect the *ceb-content* attribute
    var contentRegEx = /ceb\-content/im;

    // Apply a template to an element.
    function apply(tpl, el, isHandleLightDOM, isNodeReferences) {
        var lightChildren = [],
            bindedNodes = [],
            newCebContentId,
            template = tpl;

        if (isHandleLightDOM) {
            // When a node is cloned the light DOM of the cloned has to be retrived
            var oldCebContentId = el.getAttribute('ceb-old-content-id');
            // Get the light DOM
            var lightDomNode = el.querySelector('[' + oldCebContentId + ']') || el;
            // Remove the light DOM nodes from the element
            while (lightDomNode.childNodes.length > 0) {
                lightChildren.push(lightDomNode.removeChild(lightDomNode.childNodes[0]));
            }

            // Generate the new content's id value
            newCebContentId = 'ceb-' + (counter++) + '-content';
            // Update the tempate to contains the content's id
            template = template.replace(' ceb-content', ' ' + newCebContentId);
            // Keep a value of the content's id value if the node is cloned
            el.setAttribute('ceb-old-content-id', newCebContentId);
        }

        if (isNodeReferences) {
            // Update the template to detect the DOM nodes references.
            var result;
            while ((result = nodesRegEx.exec(template)) !== null) {
                var id = counter++;
                var property = result[1];
                var newAtt = 'ceb-' + id + '-ref';
                template = template.replace(' ceb-ref', ' ' + newAtt);
                bindedNodes.push({
                    attribute: newAtt,
                    property: property
                });
            }
        }

        // Make alive the template.
        el.innerHTML = template;

        // Push the light DOM nodes into the element
        if (isHandleLightDOM) {
            var contentNode = el.querySelector('[' + newCebContentId + ']');
            lightChildren.forEach(function (node) {
                contentNode.appendChild(node);
            });
        }

        if (isNodeReferences) {
            // Get the reference nodes.
            bindedNodes.forEach(function (entry) {
                feature(el)[entry.property] = el.querySelector('[' + entry.attribute + ']');
            });
        }
    }

    // ## Setup function

    // The templeting process is done before the call of the `createdCallback` method defined in the structure.
    function setup(struct, builder, options) {
        var tpl = options.template || '';
        var isHandleLightDOM = tpl.search(contentRegEx) !== -1;
        var isNodeReferences = tpl.search(nodesRegEx) !== -1;
        builder.wrap('createdCallback', function (next, el) {
            apply(tpl, el, isHandleLightDOM, isNodeReferences);
            next(arguments);
        });
    }
    feature.setup = setup;

    return feature;
}));
