{% include "/_urls.md" %}
# delegate()

The function `delegate()` returns a fresh `DelegateBuilder` providing services to define delegations on properties, attributes and methods.

The delegation is useful when the custom element is a composition of native elements.
For instance, to delegate the _disabled_ state of a custom button to the native one.
Or to delegate the _focus_ behavior of a custom button to the native one.

The API allows to:

- delegate from a property to a property
- delegate from a property to an attribute
- delegate from an attribute to a property
- delegate from an attribute to an attribute
- delegate from a method to a method

## From an attribute to the same attribute name

The registered custom element will have an attribute and a property `disabled`,
but its value is really hosted by the first child button found.

```javascript
import {element, attribute, delegate} from 'ceb';
element()
    .builders(
        delegate(attribute('disabled')).to('button')
    )
    .register('ceb-example');
```

## From an attribute to another property name

To realize cases a little bit more touchy, the targeted attribute/property can be overridden and the targeted name too. 
All combinations are available.

There, the attribute delegates to a property having another name.

```javascript
import {element, attribute, delegate} from 'ceb';
element()
    .builders(
        delegate(attribute('custom-disabled')).to('button').property('disabled')
    )
    .register('ceb-example');
```

## From a method to the same method name

Method invocations can also be delegated. 

There, the invocation of the method `focus` will invoke the method `focus` of the first child button found.

```javascript
import {element, method, delegate} from 'ceb';
element()
    .builders(
        delegate(method('focus')).to('button')
    )
    .register('ceb-example');
```

## From a method to an another method name

As for attributes and properties, the name of the delegated method can be overridden. 

There, the invocation of the method `applyFocus` will invoke the method `focus` of the first child button found.

```javascript
import {element, method, delegate} from 'ceb';
element()
    .builders(
        delegate(method('applyFocus')).to('button').method('focus')
    )
    .register('ceb-example');
```
