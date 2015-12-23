{% include "/doc/_urls.md" %}
# AMD

Using the dedicated [AMD] files from `dist/amd/`:

```javascript
// load all ceb
require(['dist/amd/ceb'], function (ceb) {
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
});
```

The [UMD] files from `dist/umd/` works well too.

Using the standalone [UMD] file from `dist/standalone/`:

```javascript
require(['dist/standalone/ceb'], function (ceb) {
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
});
```

This snippet is covered by the [AMD example][live-loader-amd].
