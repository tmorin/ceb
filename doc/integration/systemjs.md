{% include "/doc/_urls.md" %}
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

This snippet is covered by the [SystemJS example][live-loader-systemjs].

Because [SystemJS] works with [AMD] modules, files from `dist/umd/` and `dist/amd/` can also be used.
However, [SystemJS] must configured to handle them.
