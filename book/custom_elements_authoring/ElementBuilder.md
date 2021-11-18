# ElementBuilder

The class `ElementBuilder` provides services to define and register a Custom Element.

Its usage is cover by the reference documentation: [ElementBuilder](../api/classes/_tmorin_ceb_elements_core.ElementBuilder.html).
It's part of the [@tmorin/ceb-elements-core](https://www.npmjs.com/package/@tmorin/ceb-elements-core) package.

## Challenge yourself

Will you be able to ...
1. change the tag name to `<my-greeting></my-greeting>` without changing the class name?
2. transform `SimpleGreeting` as an extension of `h1`, so that can be created with `<h1 is="my-greeting"></h1>`? <small>the class of `h1` is `HTMLHeadingElement`</small>

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-slug-hash="ExmLwwd" data-editable="true" data-user="tmorin" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/ExmLwwd">
  &lt;ceb/&gt; ~ challenge/ElementBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Define a regular Custom Element

```typescript
import {ElementBuilder} from "@tmorin/ceb-bundle-web"
// defines and register the custom element class
@ElementBuilder.get().decorate()
class SimpleGreeting extends HTMLElement {
  constructor(public name = "World") {
    super();
  }
  connectedCallback() {
    this.textContent = `Hello, ${this.name}!`
  }
}
```

Once registered, the Custom Element can be created with three different styles: markup, Object-Oriented and, hybrid.

The first one relies on the tag name of the Custom Element within the markup of an HTML document.

```typescript
document.body.innerHTML = `<simple-greeting></simple-greeting>`
```

The second one relies on the Object-Oriented nature of the Custom Element.
Basically, the class can be instantiated, and the created object can be then append to the DOM.

```typescript
const helloJohn: SimpleGreeting = new SimpleGreeting("John")
document.body.appendChild(helloJohn)
```

The last one lies between the markup and OO style.

```typescript
const helloDoe: SimpleGreeting = document.createElement("simple-greeting")
helloDoe.name = "Doe"
document.body.appendChild(helloDoe)
```

## Define an extension of a native Element

```typescript
import {ElementBuilder} from "@tmorin/ceb-bundle-web"
// defines and register the custom element class
@ElementBuilder.get().extends("p").decorate()
class SimpleGreetingParagraph extends HTMLParagraphElement {
  constructor(public name = "World") {
    super();
  }
  connectedCallback() {
    this.textContent = `Hello, ${this.name}!`
  }
}
```

Once registered, the Custom Element can be created like the regular one.
However, because of the extension of a native Element, the creation expects additional information. 

The creation with the markup style:
```typescript
document.body.innerHTML = `<p is="simple-greeting-paragraph"></p>`
```

The creation with the Object-Oriented style:
```typescript
const helloJohn: SimpleGreetingParagraph = new SimpleGreeting("John")
document.body.appendChild(helloJohn)
```

The creation with the hybrid style:
```typescript
const helloDoe: SimpleGreetingParagraph = document.createElement("p", {
    extends: "is"
})
helloDoe.name = "Doe"
document.body.appendChild(helloDoe)
```
