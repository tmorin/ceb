---
title: delegate()
---
# delegate()

The function `delegate()` return a fresh `DelegateBuilder` providing services to define delegations on properties attributes and attributes.

## Import

```javascript
import {delegate} from 'custom-element-builder';
```

## Usage

The delegation is useful, when the custom element is a composition of a native element.
For instance, to delegate the _disabled_ state of a custom button to the embedded native one.
Or to delegate the _focus_ behavior of a custom button to the embedded native one.

The API allow to:

- delegate from a property to a property
- delegate from a property to an attribute
- delegate from a attribute to a property
- delegate from a attribute to an attribute
- delegate from a method to a method

### From an attribute to the same attribute name

The registered custom element will have an attribute and a property `disabled`,
but its value is really hosted by the first child button found.

```javascript
import {ceb, attribute, delegate} from 'custom-element-builder';
ceb()
    .augment(
        delegate(attribute('disabled')).to('button')
    )
    .register('ceb-example');
```

### From an attribute to another property name

To realize cases a little bit more touchy, the targeted attribute/property can be overridden and the targeted name too. 
All combinations are available.

There, the attribute delegates to a property having another name.

```javascript
import {ceb, attribute, delegate} from 'custom-element-builder';
ceb()
    .augment(
        delegate(attribute('custom-disabled')).to('button').property('disabled')
    )
    .register('ceb-example');
```

### From a method to the same method name

Method invocations can also be delegated. 

There, the invocation of the method `focus` will invoke the method `focus` of the first child button found.

```javascript
import {ceb, method, delegate} from 'custom-element-builder';
ceb()
    .augment(
        delegate(method('focus')).to('button')
    )
    .register('ceb-example');
```

### From a method to an another method name

As for attributes and properties, the name of the delegated method can be overridden. 

There, the invocation of the method `applyFocus` will invoke the method `focus` of the first child button found.

```javascript
import {ceb, method, delegate} from 'custom-element-builder';
ceb()
    .augment(
        delegate(method('applyFocus')).to('button').method('focus')
    )
    .register('ceb-example');
```
