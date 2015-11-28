# SystemJS

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
