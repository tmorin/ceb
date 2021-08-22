# Template literal

The built-in template solution provides an API to express templates based on [Template literal].
The API is the [Tagged Templates] `html`.

[Template literal]: template_literal.md
[Tagged Templates]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates

Its definition is cover by the reference documentation: [html](../api/modules/_tmorin_ceb_templating_literal.html#html).
It's part of the [@tmorin/ceb-templating-literal](https://www.npmjs.com/package/@tmorin/ceb-templating-literal) package.

## Common usages

### Text

Write the content `Hello, World!` in the `<p>` element:

```typescript
import {html, Template} from "@tmorin/ceb"
const name = "World"
const template: Template = html`<p>Hello, ${name}!</p>`
```

### Attribute

Set the value `foo` to the attribute `bar`:

```typescript
import {html, Template} from "@tmorin/ceb"
const value = "foo"
const template: Template = html`<input bar="${value}">`
```

Set boolean values, the `checked` attribute won't be rendered because its value is `false`:

```typescript
import {html, Template} from "@tmorin/ceb"
const checked = false
const template: Template = html`<input required disabled="" checked="${checked}">`
```

### Property

Set the value `foo` to the property `bar`:

```typescript
import {html, Template} from "@tmorin/ceb"
const value = "Foo"
const template: Template = html`<input p:bar="${value}">`
```

### Prevent extra processing

The special attribute `o:skip`, notifies the template engine that the children of the element should not be processed.

```typescript
import {html, Template} from "@tmorin/ceb"
const template: Template = html`<div><ul o:skip></ul></div>`
```

When rendering within a Shadow DOM, the usage of the element `<slot>` have the same effect: the children of the `slot` element won't be processed.

### Optimize patch activities

The special attribute `o:key`, notifies the template engine that the current node can be identified by a key.
The key can be of any types.

The feature should be used when rendering a dynamic list where the items can be added/removed/shift.
For each item, the `o:key` should be provided.
So that, the engine will be able to efficiently discover the related DOM nodes. 

```typescript
import {html, Template} from "@tmorin/ceb"
const lis = ["item A", "item B"].map(item => hmtl`<li o:key="${item}">${item}</li>`)
const template: Template = html`<div><ul>${lis}</ul></div>`
```

When rendering within a Shadow DOM, the usage of the element `<slot>` have the same effect: the children of the `slot` element won't be processed.

## Grey DOM

The special element `<ceb-sot></ceb-slot>` is the marker of the placeholder.

Given the following Custom Element with template expressed using the literal approach:
```typescript
import {ElementBuilder, TemplateBuilder, html, Template} from "ceb"
class HelloWorld extends HTMLElement {
  render(): Template {
    return html`<p>Hello, <ceb-slot></ceb-slot>!</p>`
  }
}

ElementBuilder.get().builder(
    TemplateBuilder.get().grey()
).register()
```

When the following statement is created and rendered:
```html
<hello-worlder>John Do</hello-worlder>
```

Then the Light DOM becomes:
```html
<hello-worlder>
  Hello, <ceb-slot>John Doe<ceb-slot>!
</hello-worlder>
```
