# <code>&lt;ceb/&gt;</code> or custom-element-builder

[![Circle CI](https://circleci.com/gh/tmorin/ceb.svg?style=svg)](https://circleci.com/gh/tmorin/ceb)
[![Dependency Status](https://david-dm.org/tmorin/ceb.svg)](https://david-dm.org/tmorin/ceb)
[![devDependency Status](https://david-dm.org/tmorin/ceb/dev-status.svg)](https://david-dm.org/tmorin/ceb#info=devDependencies)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

<code>&lt;ceb/&gt;</code> is a builder executing others builders which a the end register a [Custom Elements](http://www.w3.org/TR/custom-elements/).

Based on the builder pattern, the services provided by <code>&lt;ceb/&gt;</code> are easy to discover and use.

Furthermore, <code>&lt;ceb/&gt;</code> is natively open for extensions, so feel free to play with your own builders.

<code>&lt;ceb/&gt;</code> is dependency free.
Only not evergreen browsers have to be enhanced with a polyfill of the Custom Elements specification.

## Quick overview

```javascript
import {element, property, method} from 'ceb';

// create a fresh element builder
let builder = element();

// add a property named foo initialized to 0
builder.builders(property('foo').value(0));

// add a method named incFoo which increment the foo value
builder.builders(method('incFoo').invoke((el, num = 1 )=> el.foo = el.foo + num);

// build and register the custom element 
let CebExample = builder.register('ceb-example');

// export the class of the custom element
export default CebExample;
```

```javascript
// create an instance of ceb-example
var cebExample = document.createElement('ceb-example');

// by default foo is 0
console.log(cebExample.foo) // => 0

cebExample.incFoo();
console.log(cebExample.foo) // => now it's: 1

cebExample.incFoo(2);
console.log(cebExample.foo) // => and finally: 3
```
