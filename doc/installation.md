# Dependencies

Even if <code>&lt;ceb/&gt;</code> is transpilled from es6 to es5 with babel, the babel polyfill is not necessary. 

About, not evergreen browsers (those not implementing `document.registerElement()`) the following polyfills can be used:
 - [webcomponents.js](https://github.com/webcomponents/webcomponentsjs)
 - [document-register-element](https://github.com/WebReflection/document-register-element)

<code>&lt;ceb/&gt;</code> is fully tested against [document-register-element](https://github.com/WebReflection/document-register-element).

# From distributions files

From npm
```shell
npm install ceb
```

From bower
```shell
bower install ceb
```

# From source

Checkout sources
```shell
git clone https://github.com/tmorin/ceb.git
```

## Main npm task

Clean and build all dist files
```shell
npm run prepublish
```

## Other npm tasks

Clean working directory
```shell
npm run clean
```

Lint JavaScript source files
```shell
npm run lint
```

Build distributions files
```shell
npm run build
```

Launch karma against PhantomJS
```shell
npm run test:local
```

Launch karma against PhantomJS with hot reload
```shell
npm run test:local:watch
```

Launch karma against saucelab browsers
```shell
npm run test
```

Zip sources files
```shell
npm run zip
```

Start webpack dev server with hot reload
```shell
npm start
```

Release (version + tag + npm) the project
```shell
npm release:[pre|patch|minor|major]
```

# Integration

From ES6:
```javascript
import {ceb} from 'ceb';
```

From ES5:
```javascript
var ceb = require('ceb');
```

From AMD:
```javascript
require(['dist/amd/ceb'], function (ceb) {
    // ...
});
```

From SystemJs:
```javascript
System.import('dist/systemjs/ceb.js').then(function (ceb) {
    // ...
});
```

From UMD (Global):
```html
<script src="dist/umd/helper/type.js"></script>
<script src="dist/umd/helper/array.js"></script>
<script src="dist/umd/helper/converter.js"></script>
<script src="dist/umd/helper/function.js"></script>
<script src="dist/umd/helper/object.js"></script>
<script src="dist/umd/helper/event.js"></script>
<script src="dist/umd/builder/property.js"></script>
<script src="dist/umd/builder/attribute.js"></script>
<script src="dist/umd/builder/delegate.js"></script>
<script src="dist/umd/builder/method.js"></script>
<script src="dist/umd/builder/on.js"></script>
<script src="dist/umd/builder/template.js"></script>
<script src="dist/umd/builder/element.js"></script>
<script src="dist/umd/ceb.js"></script>
<!-- or -->
<script src="dist/standalone/ceb.js"></script>
<!-- or -->
<script src="dist/standalone/ceb.min.js"></script>
```

```javascript
(function (global) {
    var ceb = global.ceb;
}(this));
```
