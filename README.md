# custom-elements-builder

[![Circle CI](https://circleci.com/gh/tmorin/custom-elements-builder/tree/master.svg?style=svg)](https://circleci.com/gh/tmorin/custom-elements-builder/tree/master)
[![Dependency Status](https://david-dm.org/tmorin/custom-elements-builder.svg)](https://david-dm.org/tmorin/custom-elements-builder)
[![devDependency Status](https://david-dm.org/tmorin/custom-elements-builder/dev-status.svg)](https://david-dm.org/tmorin/custom-elements-builder#info=devDependencies) 

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

ceb is just a builder, natively scalable and designed for FRP.

- [Home page](http://tmorin.github.io/custom-elements-builder/)

## Dependencies

Even if _custom-element-builder_ is transpilled from es6 to es5 with babel, the babel polyfill is not necessary. 

About, not evergreen browsers (those not implementing `document.registerElement()`) the following polyfills can be used:
 - [webcomponents.js](https://github.com/webcomponents/webcomponentsjs)
 - [document-register-element](https://github.com/WebReflection/document-register-element)

## Install

From ES6;
```javascript
import {ceb} from 'custom-element-builder/es6/ceb'
```

From ES5:
```javascript
var ceb = require('custom-element-builder');
```

From AMD:
```javascript
require(['pathOfDistDir/amd/lib/ceb'], function (ceb) {
    // ...
});
```

From System:
```javascript
System.import('pathOfDistDir/system/lib/ceb.js').then(function (ceb) {
    // ...
});
```

From UMD (Global):

```html
<script src="pathOfDistDir/umd/utils.js"></script>
<script src="pathOfDistDir/umd/builder/Builder.js"></script>
<script src="pathOfDistDir/umd/builder/PropertyBuilder.js"></script>
<script src="pathOfDistDir/umd/builder/AttributeBuilder.js"></script>
<script src="pathOfDistDir/umd/builder/DelegateBuilder.js"></script>
<script src="pathOfDistDir/umd/builder/MethodBuilder.js"></script>
<script src="pathOfDistDir/umd/builder/OnBuilder.js"></script>
<script src="pathOfDistDir/umd/builder/TemplateBuilder.js"></script>
<script src="pathOfDistDir/umd/builder/CustomElementBuilder.js"></script>
<script src="pathOfDistDir/umd/ceb.js"></script>
<!-- or -->
<script src="pathOfDistDir/standalone/ceb.js"></script>
<!-- or -->
<script src="pathOfDistDir/standalone/ceb.min.js"></script>
```

```javascript
(function (global) {
    var ceb = global.ceb;
}(this));
```

## Gulp tasks

Clean built artifacts then check, test, build and generate everything.
```shell
gulp 
```

Single run of karma.
```shell
gulp karma
```

Start karma in watching mode handling browserify and babelify.
```shell
gulp karma:watch
```

Single run of karma with saucelabs browsers.
```shell
gulp karma:sauce
```

Start local server for examples
```shell
gulp browser-sync
```
