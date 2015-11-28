# Polyfills

Even if `<ceb/>` is transpilled from es2015 to es5 with babel, the babel polyfill is not necessary. 

However, not evergreen browsers (those not implementing `document.registerElement()`) have to be patched with one of the following polyfills:
 - [webcomponents.js](https://github.com/webcomponents/webcomponentsjs)
 - [document-register-element](https://github.com/WebReflection/document-register-element),

`<ceb/>` is fully tested against [document-register-element](https://github.com/WebReflection/document-register-element).

