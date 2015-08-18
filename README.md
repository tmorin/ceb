# custom-elements-builder

[![Circle CI](https://circleci.com/gh/tmorin/custom-elements-builder/tree/development.svg?style=svg)](https://circleci.com/gh/tmorin/custom-elements-builder/tree/development)
[![Dependency Status](https://david-dm.org/tmorin/custom-elements-builder/development.svg)](https://david-dm.org/tmorin/custom-elements-builder/development)
[![devDependency Status](https://david-dm.org/tmorin/custom-elements-builder/development/dev-status.svg)](https://david-dm.org/tmorin/custom-elements-builder/development#info=devDependencies)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

ceb is just a builder, natively scalable and designed for FRP.

- [Home page](http://tmorin.github.io/custom-elements-builder/)

## Dependencies

Even if _custom-element-builder_ is transpilled from es6 to es5 with babel, the babel polyfill is not necessary. 

However, _lodash_ is required for both AMD and UMD distributions.

About, not evergreen browsers (those not implementing `document.registerElement()`) the following polyfill can be used:
 - webcomponents.js
 - document-register-element

## Install

From es6;
```javascript
import {ceb} from 'custom-element-builder/es6/ceb'
// or
var ceb = require('custom-element-builder');
```

From es5:
```javascript
var ceb = require('custom-element-builder');
```

From AMD:
```javascript
require(['pathOfPublicDir/amd/ceb'], function (ceb) {
    // ...
});
```

From System:
```javascript
System.import('pathOfPublicDir/system/ceb.js'); 
```

From global:

```html
<script src="pathOfPublicDir/umd/ceb.js"></script>
```
```javascript
(function (global) {
    var ceb = global.ceb;
}(this));
```
## Gulp tasks

Launch babel and browserify.
```shell
gulp karma
```

Single run of karma.
```shell
gulp karma
```

Start karma in watching mode handling babel and browserify.
```shell
gulp karma:watch
```

Single run of karma with saucelabs browsers.
```shell
gulp karma:sauce
```

