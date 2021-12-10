# Template literal

> The template solution is part of the NPM package [@tmorin/ceb-templating-literal](https://www.npmjs.com/package/@tmorin/ceb-templating-literal).

The built-in template solution provides an API to express templates based on [Template literal].
The API is the [Tagged Templates] `html`.

[Template literal]: literal.md
[Tagged Templates]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates

## Common usages

### Text

Write the content `Hello, World!` in the `<p>` element:

```typescript
{{#include ../../packages/ceb-book-samples/src/templating/literal-text.ts}}
```

### Attribute

Set the value `foo` to the attribute `bar`:

```typescript
{{#include ../../packages/ceb-book-samples/src/templating/literal-attribute_string.ts}}
```

Set boolean values, the `checked` attribute won't be rendered because its value is `false`:

```typescript
{{#include ../../packages/ceb-book-samples/src/templating/literal-attribute_boolean.ts}}
```

### Property

Set the value `foo` to the property `bar`:

```typescript
{{#include ../../packages/ceb-book-samples/src/templating/literal-property.ts}}
```

### Prevent extra processing

The special attribute `o:skip`, notifies the template engine that the children of the element should not be processed.

```typescript
{{#include ../../packages/ceb-book-samples/src/templating/literal-option-skip.ts}}
```

When rendering within a Shadow DOM, the usage of the element `<slot>` have the same effect: the children of the `slot` element won't be processed.

### Optimize patch activities

The special attribute `o:key`, notifies the template engine that the current node can be identified by a key.
The key can be of any types.

The feature should be used when rendering a dynamic list where the items can be added/removed/shift.
For each item, the `o:key` should be provided.
So that, the engine will be able to efficiently discover the related DOM nodes. 

```typescript
{{#include ../../packages/ceb-book-samples/src/templating/literal-option-key.ts}}
```

When rendering within a Shadow DOM, the usage of the element `<slot>` have the same effect: the children of the `slot` element won't be processed.

## Grey DOM

The special element `<ceb-sot></ceb-slot>` is the marker of the placeholder.

Given the following Custom Element with template expressed using the literal approach:
```typescript
{{#include ../../packages/ceb-book-samples/src/templating/literal-grey.ts}}
```

When the following statement is created and rendered:
```html
<hello-worlder>John Doe</hello-worlder>
```

Then the Light DOM becomes:
```html
<hello-worlder>
  Hello, <ceb-slot>John Doe<ceb-slot>!
</hello-worlder>
```
