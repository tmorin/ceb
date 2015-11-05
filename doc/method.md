---
title: method()
---
# method()

The function `method()` returns a fresh `MethodBuilder` providing services to define a method and ... more.

## Import

```javascript
import {method} from 'custom-element-builder';
```

## Usage

The methods are invoked with the custom element as first argument.
So, fill free to forget the `this` keyword.

### Default

The registered custom element will have a method `meth1`.

When the method is invoked, the returned value could be `Hello world! from ceb-example`.

```javascript
import {ceb, method} from 'custom-element-builder';
ceb()
    .builders(
        method('meth1').invoke((el, name) => `Hello ${name}! from ${el.tagName}`)
    )
    .register('ceb-example');
```

### Wrapper

The registered custom element will have a method `meth1`.

When the method is invoked, the returned value could be `HELLO WORLD! FROM CEB-EXAMPLE`.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .builders(
        method('meth1')
            .invoke((el, name) => `Hello ${name}! from ${el.tagName}`)
            .wrap((next, el, name) => next(el, name.toTrim()).toUpperCase())
    )
    .register('ceb-example');
```
