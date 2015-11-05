---
title: ceb()
---
# ceb()

The function `ceb()` return a fresh `CustomElementBuilder` providing services to register a ... custom element.

## Import

```javascript
import ceb from 'custom-element-builder';
```

```javascript
import {ceb} from 'custom-element-builder';
```

## Register an element

An element is registered with the method `register()`.

```javascript
import ceb from 'custom-element-builder';
var MyCustomElement = ceb().register('my-custom-element');
```

Now the custom element can be used like another regular `HTMLElement`.

```javascript
document.createElement('my-custom-element');
```

```html
<button is="my-custom-element"></my-custom-element>
```

## Extending (native) elements

By default the prototype of the future custom element is `Object.create(HTMLElement.prototype)`.
The method `prototype()` can be used to override the default value.

To extend a native HTML element, the method `extend()` must be set with the name of the native element.
 
See the [specification](http://w3c.github.io/webcomponents/spec/custom/#api-element-registration-options) to get more information. 

```javascript
import ceb from 'custom-element-builder';
var MyCustomButton = ceb()
    .proto(Object.create(HTMLButtonElement.prototype))
    .extend('button')
    .register('my-custom-button');
```

Now the custom element can be used like another regular `HTMLButtonElement`.

However to create a custom element extending a native one, the syntax is different. 

```javascript
document.createElement('button', 'my-custom-button');
```

```html
<button is="my-custom-button"></button>
```

## Consume dedicated builders

The user friendly way to use dedicated builders is provided by the method `builders()`.

```javascript
import {ceb, attribute, property} from 'custom-element-builder';
var MyCustomElement = ceb()
    .builders(
        attribute('att1'),
        property('prop1').immutable().value('I am a constant')
    )
    .builders(attribute('att2'))
    .register('my-custom-element');
```

Builders are executed sequentially when `register()` is called.
That means, `attribute('att1')` will be executed first and `attribute('att2')` as last.

## Life cycle

The build process of `register()` is composed of two steps:

- the dedicated builders executions
- the registration of the Custom Element

These steps raise the following events:

- before:builders
- after:builders
- before:registerElement
- after:registerElement

The life cycle of the future Custom Element also raise events:

- before:createdCallback
- after:createdCallback
- before:attachedCallback
- after:attachedCallback
- before:detachedCallback
- after:detachedCallback
- before:attributeChangedCallback
- after:attributeChangedCallback

The method `on()` registers a callback about the events listed above.

```javascript
import {ceb} from 'custom-element-builder';
var MyDummyButtonElement = ceb()
    .on('before:createdCallback', (el) => el.innerHTML = '<button></button>')
    .register('my-dummy-button-element');
```


The events `before:builders`, `after:builders` and `before:registerElement` are called with the context of the builder a argument.

The event `after:registerElement` is called with the type of the custom element.

The events linked to the life cycle of the Custom Element are called with the custom element as argument.

The events `before:attributeChangedCallback` and `after:attributeChangedCallback` are called with the custom element, the attribute name, the old value and the new one.

## Provide dedicated builders

In `register()`, a dedicated builder is an object having a method `build()`, otherwise the builder will be ignored.

The methods `build()` are called with the following arguments:

- the prototype of the future Custom Element
- the instance of the method `on()`

Basically, the logic of the builder is implemented into the method `build()`.
All stuff which can not be done during the execution of the method `build()`, can be executed later using the function `on()`. 

```javascript
import {ceb} from 'custom-element-builder';
var MyDummyButtonElement = ceb()
    .builders({
        build(proto, on) {
            // this will be executed once by register call
            Object.defineProperty(proto, 'prop1', {
                writable: false,
                value: 'value1'
            });
            on('before:createdCallback'. (el) => {
                // this will be executed for each created custom element
                this.innerHTML = '<button></button>';
            });
        }
    })
    .register('my-dummy-button-element');
```
