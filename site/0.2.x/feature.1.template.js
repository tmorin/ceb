// Be careful, the template feature doesn't work with [document-register-element](https://github.com/WebReflection/document-register-element) on IE9/IE10!

// ## Overview

// The template feature works only with string forming a valid HTML fragment.

// The ceb-content attribute tells to the template feature where push the light DOM.
var xButtonTemplate = '<button ceb-content></button>';

// The template is given to the feature using the feature's options hash.
ceb().name('x-button').feature(cebFeatureTemplate, {
    template: xButtonTemplate
}).register();

// The ceb-ref attribute tells to the template feature which node reference push the templating scope (i.e. `cebFeatureTemplate(el)`).
// Obviously templates can contain custom elements.
var xFormTemplate = '';
xFormTemplate = '<form>';
xFormTemplate = '<div ceb-content></div>';
xFormTemplate = '<x-button ceb-ref="submitBtn">Reset</x-button>';
xFormTemplate = '<x-button ceb-ref="resetBtn">Submit</x-button>';
xFormTemplate = '</form>';

// The template is given to the feature using the feature's options hash.
ceb().name('x-form').feature(cebFeatureTemplate, {
    template: xFormTemplate
}).register();

// Create a new x-form element.
var xForm = document.createElement('x-form');
document.body.appendChild(xForm);

// `submitBtn` and `resetBtn` are available from the templating scope.
cebFeatureTemplate(xForm).submitBtn.click();

// Will create and append the element `span` into the content node of xForm.
xForm.contentNode.appendChild(document.createElement('span'));

// ## Light DOM

// The template can contains a node having the attribute `ceb-content`.
// The marked node is intend to host the light DOM of the current element at the end of the templating process.

// If the template doesn't contain this node, the light DOM will be lost.

// ## DOM nodes references

// The template can contains nodes having the attribute `ceb-ref`.
// The marked nodes will be available at the end of the templating process from the feature function (`cebFeatureTemplate(el)`).

// That means, if a node has the attribute `ceb-ref="header"`.
// It will be available via `cebFeatureTemplate(el).header`.
