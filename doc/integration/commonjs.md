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

[CommonJS] files should be used with tools like [webpack] and [browserify].

[npm]: https://www.npmjs.com/package/ceb
[CommonJS]: http://www.commonjs.org
[webpack]: https://webpack.github.io
[browserify]: http://browserify.org
