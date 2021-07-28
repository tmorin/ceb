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

To register `ex-greeting`, the decorator `@ElementBuilder.element` is used:

```typescript
import {
  ElementBuilder
} from "ceb";

@ElementBuilder.element<ExGreeting>()
export class ExGreeting extends HTMLElement {
}
```

## Initialize the Shadow DOM

To Shadow DOM of `ex-greeting` is initialized with the decorator `@ContentBuilder.content` is used :

```typescript
import {
  ElementBuilder,
  ContentBuilder
} from "ceb";

@ElementBuilder.element<ExGreeting>()
@ContentBuilder.content({
  content: `<p>Hello, <span id="name"></span>!</p>`,
  isShadow: true
})
export class ExGreeting extends HTMLElement {
}
```

## Capture the name

The target of the greeting is capture with the field `name` using the decorator `FieldBuilder.field` :

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder
} from "ceb";

@ElementBuilder.element<ExGreeting>()
@ContentBuilder.content({
  content: `<p>Hello, <span id="name"></span>!</p>`,
  isShadow: true
})
export class ExGreeting extends HTMLElement {
  @FieldBuilder.field()
  name: string = "World"
}
```

## Update the Shadow DOM with the captured name

Each time the field `name` mutates, the element selected by `span#name` has to be updated with the new value.
There are two ways to handle it with the built-in `<ceb/>` builders : the craft style and the delegated one.

### The  craft style

The decorator `ReferenceBuilder.reference` retrieves the reference of the element `span#name`.

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder,
  ReferenceBuilder
} from "ceb";

@ElementBuilder.element<ExGreeting>()
@ContentBuilder.content({
  content: `<p>Hello, <span id="name"></span>!</p>`,
  isShadow: true
})
export class ExGreeting extends HTMLElement {
  @FieldBuilder.field()
  name: string = "World"
  
  @ReferenceBuilder.reference({
    selector: "span#name",
    isShadow: true
  })
  span: HTMLSpanElement
}
```

Finally, the decorator `FieldBuilder.listen` handles the mutation of the field `name` to

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder,
  ReferenceBuilder,
} from "ceb";

@ElementBuilder.element<ExGreeting>()
@ContentBuilder.content({
  content: `<p>Hello, <span id="name"></span>!</p>`,
  isShadow: true
})
export class ExGreeting extends HTMLElement {
  @FieldBuilder.field()
  name: string = "World"
  
  @ReferenceBuilder.reference({
    selector: "span#name",
    isShadow: true
  })
  span: HTMLSpanElement

  @FieldBuilder.listen()
  private onName(data: FieldListenerData) {
    this.span.textContent = data.newVal
  }
}
```

### The delegated fashion

Alternatively, the decorator `AttributePropagationBuilder.delegate` can be used to automatically binds the mutation of the field `name` to the property `textContent` of the selected element `span#name` :

```typescript
import {
  ElementBuilder,
  ContentBuilder,
  FieldBuilder,
  AttributePropagationBuilder
} from "ceb";

@ElementBuilder.element<ExGreeting>()
@ContentBuilder.content({
  content: `<p>Hello, <span id="name"></span>!</p>`,
  isShadow: true
})
@AttributePropagationBuilder.delegate(
  "name",
  "span#name",
  {
    isShadow: true,
    toPropName: "textContent"
  }
)
export class ExGreeting extends HTMLElement {
  @FieldBuilder.field()
  name: string = "World"
}
```
