{% include "/doc/_urls.md" %}
# attribute()

The function `attribute()` returns a fresh `AttributeBuilder` providing services to define ... an attribute.

Attributes are by default bound to a property.
So, the value can be read or updated from both API DOM and property.

## Add an attribute

The registered custom element will have a property `att1` bound to an attribute `att1`.

```javascript
import {element, attribute} from 'ceb';
element()
    .builders(
        attribute('att1')
    )
    .register('ceb-example');
```

## Add boolean attribute

The registered custom element will have a property `att1` bound to an attribute `att1`.
But when the property `att1` is `true`, the attribute `att1` get an empty value.
And when the property `att1` is `false`, the attribute `att1` is not present into the DOM.

```javascript
import {element, attribute} from 'ceb';
element()
    .builders(
        attribute('att1').boolean()
    )
    .register('ceb-example');
```

## Unbound an attribute to its property

By default the attribute will be linked to a property.
The link can be skip calling the `.unbound()` method.

The registered custom element will have an attribute `att1`.
But the property `att1` will not be defined, and obviously not bound to the attribute.

```javascript
import {element, attribute} from 'ceb';
element()
    .builders(
        attribute('att1').unbound()
    )
    .register('ceb-example');
```

## Override name of its bound property

The registered custom element will have a property `prop1` bound to an attribute `att1`.

```javascript
import {element, attribute} from 'ceb';
element()
    .builders(
        attribute('att1').property('prop1')
    )
    .register('ceb-example');
```

## Listen the attribute value

Listeners are called when the attribute's value is updated.
When the attribute has the flag _boolean_, `oldVal` and `newVal` will boolean values.
Otherwise, it will be string values.

```javascript
import {element, attribute} from 'ceb';
element()
    .builders(
        attribute('att1')
            .listen((el, oldVal, newVal) => {
                /* oldVal was the (string) value of the attribute and
                   newVal is the current (string) value of the attribute */
            })
    )
    .register('ceb-example');
```
