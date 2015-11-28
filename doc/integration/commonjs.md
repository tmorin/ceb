# CommonJS

By default, the npm package loads the [CommonJS](http://www.commonjs.org/) files from `lib/`.

Using the [CommonJS](http://www.commonjs.org/) `require()` function:
```javascript
var ceb = require('ceb');

ceb.element(
    ceb.property('foo'),
    ceb.attribute('bar')
).register('ceb-example');
```
