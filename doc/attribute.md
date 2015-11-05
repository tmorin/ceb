---
title: attribute()
---
# attribute()

The function `attribute()` returns a fresh `AttributeBuilder` providing services to define ... an attribute.

## Import

```javascript
import {attribute} from 'custom-element-builder';
```

## Usage

`AttributeBuilder` extending `PropertyBuilder`, the attribute is also a property.
So, the value can be read or updated from both API DOM and property.

The `getter` and `setter` functionality provided by `PropertyBuilder` can not be used with attributes.
Obviously, an attribute can not be immutable.

### Default

The registered custom element will have a property `att1` bound to an attribute `att1`.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .builders(
        attribute('att1')
    )
    .register('ceb-example');
```

### Boolean attribute

The registered custom element will have a property `att1` bound to an attribute `att1`.
But when the property `att1` is `true`, the attribute `att1` get an empty value.
And when the property `att1` is `false`, the attribute `att1` is not present into the DOM.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .builders(
        attribute('att1').boolean()
    )
    .register('ceb-example');
```

### Unbound attribute

By default the attribute will be linked to a property.
The link can be skip calling the `.unbound()` method.

The registered custom element will have an attribute `att1`.
But the property `att1` will not be defined, and obviously not bound the attribute.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .builders(
        attribute('att1').unbound()
    )
    .register('ceb-example');
```

### Override the property name

The registered custom element will have a property `prop1` bound to an attribute `att1`.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .builders(
        attribute('att1').property('prop1')
    )
    .register('ceb-example');
```

### Listen

Listeners are called when the attribute's value is updated.
When the attribute has the flag _boolean_, `oldVal` and `newVal` will boolean values.
Otherwise, it will be string values.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .builders(
        attribute('att1')
            .setter((el, value) => parseInt(value, 0) + 1)
            .listen((el, oldVal, newVal) => {
                /* oldVal was the (string) value of the attribute and
                   newVal is the current (string) value of the attribute */
            })
    )
    .register('ceb-example');
```
