# AMD

Using the [UMD] file from `dist/umd/`:

```javascript
// load all ceb
require(['dist/umd/ceb'], function (ceb) {
    ceb.element(
        ceb.property('foo'),
        ceb.attribute('bar')
    ).register('ceb-example');
});
```
[UMD]: https://github.com/umdjs/umd
