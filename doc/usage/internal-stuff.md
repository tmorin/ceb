{% include "/doc/_urls.md" %}
# Internal stuff

As said before, `<ceb/>` is open to extension.
This extensibility is done defining dedicated builders.

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

## Dedicated builders

In `register()`, a dedicated builder is an object having a method `build()`, otherwise the builder will be ignored.

The methods `build()` are called with the following arguments:

- the prototype of the future Custom Element
- the instance of the method `ElementBuilder.on()`

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

## Example

Several examples are available:
 
* [baconify](../../example/builders/baconify.md)
* [handlebarify](../../example/builders/handlebarify.md)
* [idomify](../../example/builders/idomify.md)
* [reduxify](../../example/builders/reduxify.md)
