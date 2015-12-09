{% include "/doc/_urls.md" %}
# As a global variable

Using the [UMD] files from `dist/umd/`:

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

Using the standalone [UMD] file from `dist/standalone/`:

```html
<!-- not minified -->
<script src="dist/standalone/ceb.js"></script>
```

```html
<!-- minified -->
<script src="dist/standalone/ceb.min.js"></script>
```

`<ceb/>` is available from `window.ceb`:

```javascript
(function (global) {
    var ceb = global.ceb;
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
}(this));
```
