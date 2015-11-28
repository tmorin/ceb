# AMD

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
