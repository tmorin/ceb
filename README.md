# `<ceb/>` <small>custom-element-builder</small>

[![Circle CI](https://circleci.com/gh/tmorin/ceb.svg?style=svg)](https://circleci.com/gh/tmorin/ceb)
[![Dependency Status](https://david-dm.org/tmorin/ceb.svg)](https://david-dm.org/tmorin/ceb)
[![devDependency Status](https://david-dm.org/tmorin/ceb/dev-status.svg)](https://david-dm.org/tmorin/ceb#info=devDependencies)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

`<ceb/>` is a library helping to develop [Custom Elements](http://www.w3.org/TR/custom-elements/).

It's core is a builder which executes others builders.
By this way, `<ceb/>` is natively opened to extensions and builders easily sharable. 

Obviously, `<ceb/>` exposes builders and helpers to handle the common needs:

- property
- attribute
- events
- delegation to child element (attribute, property and method)
- templating
- event dispatching
- type checking
- etc.

## Quick overview

```javascript
import {element, property, method, dispatchCustomEvent} from 'ceb';

// create a fresh element builder
let builder = element();

builder.builders(
    // add a property named foo initialized to 0
    property('foo').value(0),

    // add a method named incFoo, which will increment the foo value
    method('incFoo').invoke( (el, num=1) => el.foo = el.foo + num )
);

builder.builders(
    // add a method named bar, which will dispatch the custom event 'bar' when invoked
    method('bar').invoke( (el, detail) => dispatchCustomEvent(el, 'bar', {detail}) )
);

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

cebExample.bar('foo'); // => dispatch the custom event 'bar' with the detail 'foo'
```

## Download

`<ceb/>` is available from 
[npm](https://www.npmjs.com/package/ceb)
and bower.

From npm:
```shell
npm install ceb
```

From bower:
```shell
bower install ceb
```

## License

Released under the [MIT license](http://opensource.org/licenses/MIT).
