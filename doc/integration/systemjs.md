# SystemJS

Using the dedicated [SystemJS] files from `dist/systemjs/`:

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

Because [SystemJS] works with [AMD] and [UMD] modules, the dist files from `dist/umd/` can also be used.
However, [SystemJS] must configured to handle them.

[SystemJS]: https://github.com/systemjs/systemjs
[UMD]: https://github.com/umdjs/umd
[AMD]: https://github.com/amdjs/amdjs-api
