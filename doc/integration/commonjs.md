{% include "/doc/_urls.md" %}
# CommonJS

By default, the [npm package][npm] loads the [CommonJS] files from `lib/`.

Using the [CommonJS] `require()` function:
```javascript
var ceb = require('ceb');

ceb.element(
    ceb.property('foo'),
    ceb.attribute('bar')
).register('ceb-example');
```

[CommonJS] files should be used with [webpack], [browserify] or any bundling tools.
