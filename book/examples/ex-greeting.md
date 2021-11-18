# ex-greeting

_The source code of the implementation and, the test of this example are available in the Git repository
of `<ceb/>` : `examples/ex-greeting`._

This example demonstrates how to leverage on some builders and decorators to create a Custom Element which displays a greeting message.

## Initiate the Custom Element class

The Custom Element `ex-greeting` is a regular ES6 class which extends HTMLElement :

```typescript
export class ExGreeting extends HTMLElement {
}
```

## Register the Custom Element

To register `ex-greeting`, the decorator of `@ElementBuilder` is used:

```typescript
import {
  ElementBuilder
} from "@tmorin/ceb-bundle-web";

@ElementBuilder.get().decorate()
export class ExGreeting extends HTMLElement {
}
```

## Initialize the Shadow DOM

The Shadow DOM of `ex-greeting` is initialized with the decorator of `@ContentBuilder` :

```typescript
import {
  ElementBuilder,
  ContentBuilder
} from "@tmorin/ceb-bundle-web";

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
export class ExGreeting extends HTMLElement {
}
```

## Capture the name

The target of the greeting is captured with the field `name` using the decorator of `FieldBuilder` :

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder
} from "@tmorin/ceb-bundle-web";

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
export class ExGreeting extends HTMLElement {
  @FieldBuilder.get().decorate()
  name: string = "World"
}
```

## Update the Shadow DOM with the captured name

Each time the field `name` mutates, the element selected by `span#name` has to be updated with the new value.
There are two ways to handle it with the built-in `<ceb/>` builders : the craft style and the propagation way.

### The craft style

The decorator of `ReferenceBuilder` retrieves the reference of the element `span#name`.

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder,
  ReferenceBuilder
} from "@tmorin/ceb-bundle-web";

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
export class ExGreeting extends HTMLElement {
  @FieldBuilder.get().decorate()
  name: string = "World"
  
  @ReferenceBuilder.get()
    .shadow()
    .selector("span#name")
    .decorate()
  span: HTMLSpanElement
}
```

Finally, the decorator of `FieldBuilder` handles the mutation of the field `name`.

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder,
  ReferenceBuilder,
} from "@tmorin/ceb-bundle-web";

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
export class ExGreeting extends HTMLElement {
  @FieldBuilder.get().decorate()
  name: string = "World"

  @ReferenceBuilder.get()
    .shadow()
    .selector("span#name")
    .decorate()
  span: HTMLSpanElement

  @FieldBuilder.get().decorate()
  private onName(data: FieldListenerData) {
    this.span.textContent = data.newVal
  }
}
```

### The propagation way

Alternatively, the decorator of `AttributePropagationBuilder` can be used to automatically binds the mutation of the field `name` to the property `textContent` of the selected element `span#name` :

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder,
  AttributePropagationBuilder
} from "@tmorin/ceb-bundle-web";

@ElementBuilder.get().decorate()
@ContentBuilder.get(`<p>Hello, <span id="name"></span>!</p>`)
  .shadow()
  .decorate()
@AttributePropagationBuilder.get("name")
  .shadow()
  .to("span#name")
  .property("textContent")
  .decorate()
export class ExGreeting extends HTMLElement {
  @FieldBuilder.get().decorate()
  name: string = "World"
}
```
