/*
 * ceb 0.0.0 http://tmorin.github.io/custom-element-builder
 * Custom Elements Builder (ceb) is ... a builder for Custom Elements.
 * Buil date: 2015-01-29
 * Copyright 2015-2015 Thibault Morin
 * Available under MIT license
 */
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
(function(g, factory) {
    "use strict";
    /* istanbul ignore next */
    if (typeof exports === "object") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define("ceb-feature-template", [], factory);
    } else {
        g.cebFeatureTemplate = factory();
    }
})(this, function() {
    "use strict";
    // ## feature function
    // The template feature's function returns the nodes' reference of the template.
    function feature(el) {
        if (!el.__cebTemplateScope) {
            el.__cebTemplateScope = {
                nodes: {}
            };
        }
        return el.__cebTemplateScope;
    }
    // ## Templating stuff
    // The counter is used to generate unique DOM's id.
    var counter = 0;
    // Regex to detect the *ceb-ref* attributes
    var nodesRegEx = /ceb\-ref=\W*(\w*)/gim;
    // Regex to detect the *ceb-content* attribute
    var contentRegEx = /ceb\-content/im;
    // Apply a template to an element.
    function apply(template, el) {
        // When a node is cloned the light DOM of the cloned has to be retrived
        var oldCebContentId = el.getAttribute("ceb-content-id");
        // Get the light DOM
        var lightDomNode = el.querySelector("[" + oldCebContentId + "]") || el;
        // Remove the light DOM nodes from the element
        var lightChildren = [];
        while (lightDomNode.childNodes.length > 0) {
            lightChildren.push(lightDomNode.removeChild(lightDomNode.childNodes[0]));
        }
        // Generate the new content's id value
        var newCebContentId = "tpl-" + counter++ + "-ceb-content";
        // Update the tempate to contains the content's id
        template = template.replace(" ceb-content", " " + newCebContentId);
        // Keep a value of the content's id value if the node is cloned
        el.setAttribute("ceb-content-id", newCebContentId);
        // Update the template to detect the DOM nodes references.
        var bindedNodes = [], result;
        while ((result = nodesRegEx.exec(template)) !== null) {
            var id = counter++;
            var property = result[1];
            var newAtt = "tpl-" + id + "-ceb-ref";
            template = template.replace(" ceb-ref", " " + newAtt);
            bindedNodes.push({
                attribute: newAtt,
                property: property
            });
        }
        // Make alive the template.
        el.innerHTML = template;
        // Push the light DOM nodes into the element
        if (contentRegEx.test(template)) {
            var contentNode = el.querySelector("[" + newCebContentId + "]");
            lightChildren.forEach(function(node) {
                contentNode.appendChild(node);
            });
        }
        // Get the reference nodes.
        bindedNodes.forEach(function(entry) {
            feature(el)[entry.property] = el.querySelector("[" + entry.attribute + "]");
        });
    }
    // ## Setup function
    // The templeting process is done before the call of the `createdCallback` method defined in the structure.
    function setup(struct, builder, options) {
        builder.wrap("createdCallback", function(next, el) {
            apply(options.template || "", el);
            next(arguments);
        });
    }
    feature.setup = setup;
    return feature;
});
