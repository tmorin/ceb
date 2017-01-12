# property()

The function `property()` returns a fresh `PropertyBuilder` providing services to define ... a property.

At the end the property is added to the prototype via `Object.defineProperty()`.

## Add an immutable fields

The registered custom element will have a property `prop1` initialized with the value `value1`.
But, the property can not be deleted, and its value can not be updated.

```javascript
import {element, property} from 'ceb';
element()
    .builders(
        property('prop1').immutable().value('value1')
    )
    .register('ceb-example');
```

## Add setter and getter with a default value

The registered custom element will have a property `prop1` initialized with the value `0`.

When the property is set, its value will be incremented.

Getter and setter are invoked with the custom element as first argument.
So, fill free to forget the `this` keyword.

```javascript
import {element, property} from 'ceb';
element()
    .builders(
        property('prop1')
            .setter((el, value) => {
                el._prop1 = value + 1; 
            })
            .getter(el => {
                return el._prop1;
            })
            .value(0)
        )
    .register('ceb-example');
```

## Listen the property value

Listeners are called when the property's value is updated (i.e. the _setter_).

If the property's builder is not configured with _getter_ or _setter_, there will be created.
Otherwise the original _setter_ will be wrapped by the listener one.

```javascript
import {element, property} from 'ceb';
element()
    .builders(
        property('att1')
            .listen((el, oldVal, newVal) => {
                // ...
            })
    )
    .register('ceb-example');
```
