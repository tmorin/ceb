# element()

The function `element()` return a fresh `ElementBuilder` providing services to register a ... custom element.

## Register an element

An element is registered with the method `register()`.

```javascript
import {element} from 'ceb';
var MyCustomElement = element().register('my-custom-element');
```

Now the custom element can be used like another regular `HTMLElement`.

```javascript
document.createElement('my-custom-element');
```

```html
<my-custom-element></my-custom-element>
```

## Extending (native) elements

By default the prototype of the future custom element is `Object.create(HTMLElement.prototype)`.
The method `base()` can be used to override the default value.

To extend a native HTML element, the method `base()` can also be to set the name of the native element.
 
See the [specification](http://w3c.github.io/webcomponents/spec/custom/#api-element-registration-options) to get more information. 

```javascript
import {element} from 'ceb';
var MyCustomButton = element()
    .base(Object.create(HTMLButtonElement.prototype), 'button')
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

The arguments of the method `base()` can be swapped:
```javascript
element().base(prototypeValue, extendsValue);
element().base(extendsValue, prototypeValue);
```

The method `base()` can also be called sequentially:
```javascript
// set the prototype
element().base(prototypeValue);

// then if needed, set the name of the native element
element().base(extendsValue);
```

## Consume dedicated builders

The user friendly way to use dedicated builders is provided by the method `builders()`.

```javascript
import {element, attribute, property} from 'ceb';
var MyCustomElement = element()
    .builders(
        attribute('att1'),
        property('prop1').immutable().value('I am a constant')
    )
    .builders(attribute('att2'))
    .register('my-custom-element');
```

Builders are executed sequentially when `register()` is called.
That means, `attribute('att1')` will be executed first and `attribute('att2')` will be the last one.

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
import {element} from 'ceb';
var MyDummyButtonElement = element()
    .on('before:createdCallback', el => el.innerHTML = '<button></button>')
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
import {element} from 'ceb';
var MyDummyButtonElement = element()
    .builders({
        build(proto, on) {
            // this will be executed once by register call
            Object.defineProperty(proto, 'prop1', {
                writable: false,
                value: 'value1'
            });
            on('before:createdCallback', el => {
                // this will be executed for each created custom element
                el.innerHTML = '<button></button>';
            });
        }
    })
    .register('my-dummy-button-element');
```
