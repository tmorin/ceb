# ElementBuilder

The class `ElementBuilder` provides services to enhance and register a custom element.
It's the main builder, the entry point of the library.

The static method `CustomElement.get(constructor)` returns a fresh builder.
The method expects the constructor of the custom element.

```typescript
import {ElementBuilder} from '@tmorin/ceb'
// defines the custom element class
class MyCustomElement extends HTMLElement {
    constructor() {
        super()
    }
}
// creates the builder
const builder = ElementBuilder.get(MyCustomElement)
```

The builder and underlying decorators are also technically documented: [ElementBuilder](../api/classes/elementbuilder.html).

## Registering a new custom element

A custom element is registered with the method `ElementBuilder#register()`.

```typescript
import {ElementBuilder} from '@tmorin/ceb'
// defines the custom element class
class MyCustomElement extends HTMLElement {
    constructor() {
        super();
    }
}
// creates the builder
const builder = ElementBuilder.get(MyCustomElement)
// register the custom element
builder.register()
```

The custom element can also be registered by a decorator.

```typescript
import {ElementBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElement>()
// defines the custom element class
class MyCustomElement extends HTMLElement {
    constructor() {
        super()
    }
}
```

By default, the name of the custom element is the kebab case of the class name.
So, `MyCustomElement` becomes `my-custom-element`.

Once registered, the custom element can be created as any other HTML elements.

```html
<!-- creates the custom element in HTML as any other HTML elements -->
<my-custom-element></my-custom-element>
```

```typescript
// creates the custom element from its tag name
const myCustomElement = document.createElement('my-custom-element')
// appends the custom element as any other regular HTML element
document.body.append(myCustomElement)
```

## Extending a built-in element

To register custom element which extends a built-in HTML elements, the tag name of the extended element has to be provided using the method `ElementBuilder#extends()`.

```typescript
import {ElementBuilder} from '@tmorin/ceb'
// defines the custom element class
class MyCustomButton extends HTMLButtonElement {
    constructor() {
        super()
    }
}
// creates the builder
const builder = ElementBuilder.get(MyCustomButton)
// provides the tag name of HTMLButtonElement
builder.extends('button')
// register the custom element
builder.register()
```

The extended HTML element can also be provided with the decorator.

```typescript
import {ElementBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomButton>({
    // provides the tag name of HTMLButtonElement
    extends: 'button'
})
// defines the custom element class
class MyCustomButton extends HTMLButtonElement {
    constructor() {
        super()
    }
}
```

Once registered, the custom element can be created.

```html
<!-- creates the extended HTML element using the `is` attribute -->
<button is="my-custom-button"></button>
```

```typescript
// creates the extended HTML element
const myCustomElement = document.createElement('button', {is: 'my-custom-button'})
// appends the extended HTML element as any other regular HTML element
document.body.append(myCustomElement)
```

## Overriding the name of the custom element

The name of the custom element can be overridden using the method `ElementBuilder#name(tagName)`.

```typescript
import {ElementBuilder} from '@tmorin/ceb'
// defines the custom element class
class MyCustomElementBis extends HTMLElement {
    constructor() {
        super()
    }
}
// creates the builder
const builder = ElementBuilder.get(MyCustomElementBis)
// overrides the default tag name
builder.name('another-name')
// register the custom element
builder.register()
```

The name of the custom element can also be provided with the decorator.

```typescript
import {ElementBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElementBis>({
    // overrides the default tag name
    name: 'another-name'
})
// defines the custom element class
class MyCustomElementBis extends HTMLButtonElement {
    constructor() {
        super()
    }
}
```

In this case, the name of the custom element is `another-name`.

```html
<!-- creates the custom element in HTML as any other HTML elements -->
<another-name></another-name>
```

## An example

The registered custom element is a simple element having the text content `Hello! I'm <the element's name>.`.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-slug-hash="abzmRvm" data-editable="true" data-user="tmorin" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/abzmRvm">
  &lt;/ceb&gt; ~ ElementBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
