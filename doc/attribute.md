---
title: attribute()
---
# attribute()

The function `attribute()` return a fresh `AttributeBuilder` providing services to define ... an attribute.

## Import

```javascript
import {attribute} from 'custom-element-builder';
```

## Usage

`AttributeBuilder` extending `PropertyBuilder`, the attribute is also a property.
So, the value can be read or updated from both API DOM and property.

The `getter` functionality provider by `PropertyBuilder` can not be used with attributes. 

### Default

The registered custom element will have a property `att1` bound to an attribute `att1`.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .augment(
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
    .augment(
        attribute('att1').boolean()
    )
    .register('ceb-example');
```

### Override the property name

The registered custom element will have a property `prop1` bound to an attribute `att1`.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .augment(
        attribute('att1').property('prop1')
    )
    .register('ceb-example');
```

### Setter

The registered custom element will have a property `att1` bound to an attribute `att1`.

The setter will be invoked with the custom element and the set value as arguments.
However, the setter must return the value which will be set to the attribute.

```javascript
import {ceb, attribute} from 'custom-element-builder';
ceb()
    .augment(
        attribute('att1').setter((el, value) => value + 1)
    )
    .register('ceb-example');
```
