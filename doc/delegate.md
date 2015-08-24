---
title: delegate()
---
# delegate()

The function `delegate()` return a fresh `DelegateBuilder` providing services to define a delegation on an attribute or an attribute.

## Import

```javascript
import {delegate} from 'custom-element-builder';
```

## Usage

The delegation is useful, when the custom element is a composition of a native element.
For instance, to delegate the _disabled_ state of a custom button to the embedded native one.

The API allow to:

- delegate from a property to a property
- delegate from a property to an attribute
- delegate from a attribute to a property
- delegate from a attribute to an attribute

### An attribute to the same attribute

The registered custom element will have an attribute and a property `disabled`,
but its value is really hosted by the first button child found.

```javascript
import {ceb, attribute, delegate} from 'custom-element-builder';
ceb()
    .augment(
        delegate(attribute('disabled')).to('button')
    )
    .register('ceb-example');
```

### An attribute to something else

To realize cases a little bit more touchy, the targeted attribute/property can be overridden and the targeted name too. 
All combinations are available.

There, the property delegates to an attribute having another name.

```javascript
import {ceb, attribute, delegate} from 'custom-element-builder';
ceb()
    .augment(
        delegate(attribute('custom-disabled')).to('button').attribute('disabled')
    )
    .register('ceb-example');
```

