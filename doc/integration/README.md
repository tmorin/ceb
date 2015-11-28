# Integration

## Polyfills

Even if <code>&lt;ceb/&gt;</code> is transpilled from es2015 to es5 with babel, the babel polyfill is not necessary. 

However, not evergreen browsers (those not implementing `document.registerElement()`) have to be patched with one of the following polyfills:
 - [webcomponents.js](https://github.com/webcomponents/webcomponentsjs)
 - [document-register-element](https://github.com/WebReflection/document-register-element),

<code>&lt;ceb/&gt;</code> is fully tested against [document-register-element](https://github.com/WebReflection/document-register-element).


## As a global variable

Using the [UMD](https://github.com/umdjs/umd) files from `dist/umd/`:

```html
<!-- load helpers, keep the order ;) -->
<script src="dist/umd/helper/types.js"></script>
<script src="dist/umd/helper/arrays.js"></script>
<script src="dist/umd/helper/converters.js"></script>
<script src="dist/umd/helper/functions.js"></script>
<script src="dist/umd/helper/objects.js"></script>
<script src="dist/umd/helper/events.js"></script>

<!-- load builders -->
<script src="dist/umd/builder/property.js"></script>
<script src="dist/umd/builder/attribute.js"></script>
<script src="dist/umd/builder/delegate.js"></script>
<script src="dist/umd/builder/method.js"></script>
<script src="dist/umd/builder/on.js"></script>
<script src="dist/umd/builder/template.js"></script>

<!-- load the main builder -->
<script src="dist/umd/builder/element.js"></script>

<!-- load ceb -->
<script src="dist/umd/ceb.js"></script>
```

Using the standalone [UMD](https://github.com/umdjs/umd) file from `dist/standalone/`:

```html
<!-- not minified -->
<script src="dist/standalone/ceb.js"></script>
```

```html
<!-- minified -->
<script src="dist/standalone/ceb.min.js"></script>
```

<code>&lt;ceb/&gt;</code> is available from `window.ceb`:

```javascript
(function (global) {
    var ceb = global.ceb;
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
}(this));
```


## AMD

Using the dedicated [AMD](https://github.com/amdjs/amdjs-api) files from `dist/amd/`:

```javascript
// load all ceb
require(['dist/amd/ceb'], function (ceb) {
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
});
```

The [UMD](https://github.com/umdjs/umd) files from `dist/umd/` works well too.

Using the standalone [UMD](https://github.com/umdjs/umd) file from `dist/standalone/`:

```javascript
require(['dist/standalone/ceb'], function (ceb) {
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
});
```

## SystemJS

Using the dedicated [SystemJS](https://github.com/systemjs/systemjs) files from `dist/systemjs/`:

```javascript
System.config({
    meta: {
        './dist/systemjs/*': {format: 'register'}
    }
});
System.import('./dist/systemjs/ceb.js').then(function (ceb) {
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
});
```

Because [SystemJS](https://github.com/systemjs/systemjs) works with [AMD](https://github.com/amdjs/amdjs-api) modules,
files from `dist/umd/` and `dist/amd/` can also be used.
However, [SystemJS](https://github.com/systemjs/systemjs) must configured to handle them.

## CommonJS

By default, the npm package loads the [CommonJS](http://www.commonjs.org/) files from `lib/`.

Using the [CommonJS](http://www.commonjs.org/) `require()` function:
```javascript
var ceb = require('ceb');

ceb.element(
    ceb.property('foo'),
    ceb.attribute('bar')
).register('ceb-example');
```

## ES2015

Using the `import` key word to load the [CommonJS](http://www.commonjs.org/) files from `lib/`.
```javascript
import {element, property, attribute} from 'ceb';
```

The [ES2015](http://babeljs.io/) source files are available from `src/`.

Using the `import` key word to load the [ES2015](http://babeljs.io/) files from `src/`.
```javascript
import {element, property, attribute} from 'ceb/src/ceb.js';
```

Using the `import` key word to load the [ES2015](http://babeljs.io/) files one by one from `src/`.
```javascript
import {element} from 'ceb/src/builder/element.js';
import {property} from 'ceb/src/builder/property.js';
import {attribute} from 'ceb/src/builder/attribute.js';
```

And at the end:
```javascript
element(
    property('foo'),
    attribute('bar')
).register('ceb-example');
```
