# ex-greeting

This example demonstrates how to leverage on some builders and decorators to create a Custom Element which displays a greeting message.

The example is available on [codepen.io](https://codepen.io/tmorin/pen/QWqKNwZ)!

## Initiate the Custom Element class

The Custom Element `ex-greeting` is a regular ES6 class which extends HTMLElement :

```typescript
{{#include ../../packages/ceb-book-samples/src/examples/ex-greeting/book_step1.ts}}
```

## Register the Custom Element

To register `ex-greeting`, the decorator of `@ElementBuilder` is used:

```typescript
{{#include ../../packages/ceb-book-samples/src/examples/ex-greeting/book_step2.ts}}
```

## Initialize the Shadow DOM

The Shadow DOM of `ex-greeting` is initialized with the decorator of `@ContentBuilder` :

```typescript
{{#include ../../packages/ceb-book-samples/src/examples/ex-greeting/book_step3.ts}}
```

## Capture the name

The target of the greeting is captured with the field `name` using the decorator of `FieldBuilder` :

```typescript
{{#include ../../packages/ceb-book-samples/src/examples/ex-greeting/book_step4.ts}}
```

## Update the Shadow DOM with the captured name

Each time the field `name` mutates, the element selected by `span#name` has to be updated with the new value.
There are two ways to handle it with the built-in `<ceb/>` builders : the craft style and the propagation way.

### The craft style

The decorator of `ReferenceBuilder` retrieves the reference of the element `span#name`.

```typescript
{{#include ../../packages/ceb-book-samples/src/examples/ex-greeting/book_step5_craft_1.ts}}
```

Finally, the decorator of `FieldBuilder` handles the mutation of the field `name`.

```typescript
{{#include ../../packages/ceb-book-samples/src/examples/ex-greeting/book_step5_craft_2.ts}}
```

### The propagation way

Alternatively, the decorator of `AttributePropagationBuilder` can be used to automatically binds the mutation of the field `name` to the property `textContent` of the selected element `span#name` :

```typescript
{{#include ../../packages/ceb-book-samples/src/examples/ex-greeting/ExGreeting.ts}}
```
