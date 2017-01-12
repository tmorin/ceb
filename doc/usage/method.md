# method()

The function `method()` returns a fresh `MethodBuilder` providing services to define a method and ... more.

The methods are invoked with the custom element as first argument.
So, fill free to forget the `this` keyword.

## Add method

The registered custom element will have a method `meth1`.

When the method is invoked, the returned value should be `Hello world! from ceb-example`.

```javascript
import {element, method} from 'ceb';
element()
    .builders(
        method('meth1').invoke((el, name) => `Hello ${name}! from ${el.tagName}`)
    )
    .register('ceb-example');
```

## Wrap a method

The registered custom element will have a method `meth1`.

But, when the method is invoked, the returned value should be `HELLO WORLD! FROM CEB-EXAMPLE`.

```javascript
import {element, attribute} from 'ceb';
element()
    .builders(
        method('meth1')
            .invoke((el, name) => `Hello ${name}! from ${el.tagName}`)
            .wrap((next, el, name) => next(el, name.toTrim()).toUpperCase())
    )
    .register('ceb-example');
```

## Handling native method

Some times, the custom element instance as first argument is problematic
when dealing with delegation and wrapping on native method.

The modifier `native()` skip it, handling arguments as given by the invocation.

```javascript
import {element, attribute} from 'ceb';
element()
    .builders(
        method('meth1')
            .native()
            .invoke(name => `Hello ${name}! from ceb-example}`)
            .wrap((next, name) => next(name.toTrim()).toUpperCase())
    )
    .register('ceb-example');
```
