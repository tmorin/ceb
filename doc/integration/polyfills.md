{% include "/_urls.md" %}
# Polyfills

Even if `<ceb/>` is transpilled from [ES2015] to [es5] with [babel], the babel polyfill is not necessary. 

However, not evergreen browsers (those not implementing `document.registerElement()`) have to be patched with one of the following polyfills:
 
* [webcomponents.js]
* [document-register-element]

`<ceb/>` is fully tested against [document-register-element].
