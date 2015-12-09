{% include "/doc/_urls.md" %}
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
