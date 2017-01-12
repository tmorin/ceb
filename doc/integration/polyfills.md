# Polyfills

Even if `<ceb/>` is transpilled from [ES2015] to [ES5] with [babel], the babel polyfill is not necessary. 

However, not evergreen browsers (those not implementing `document.registerElement()`) have to be patched with one of the following polyfills:
 
* [webcomponents.js]
* [document-register-element]

`<ceb/>` is fully tested against [document-register-element].

[ES2015]: http://www.ecma-international.org/ecma-262/6.0
[ES5]: http://www.ecma-international.org/ecma-262/5.1
[babel]: http://babeljs.io
[webcomponents.js]: https://github.com/webcomponents/webcomponentsjs
[document-register-element]: https://github.com/WebReflection/document-register-element
