{% include "/doc/_urls.md" %}
# element()

The function `element()` returns a fresh `ElementBuilder` providing services to register a ... custom element.

## Register an element

An element is registered with the method `register()`.

```javascript
import {element} from 'ceb';
const MyCustomElement = element().register('my-custom-element');
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
 
See the [specification][custom-element-specification-registration] to get more information. 

```javascript
import {element} from 'ceb';
const MyCustomButton = element()
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
const MyCustomElement = element()
    .builders(
        attribute('att1'),
        property('prop1').immutable().value('I am a constant')
    )
    .builders(attribute('att2'))
    .register('my-custom-element');
```

Builders are executed sequentially when `register()` is called.
That means, `attribute('att1')` will be executed first and `attribute('att2')` will be the last one.
