# TemplateBuilder

The class `TemplateBuilder` provides service to patch the DOM of the custom element.

The static method `TemplateBuilder.get()` returns a fresh builder.

```typescript
import {ContentBuilder} from '@tmorin/ceb'
// creates the builder
const builder = TemplateBuilder.get()
```

The builder and underlying decorators are also technically documented: [TemplateBuilder](../api/classes/templatebuilder.html).

## The method, the template and the DOM

The main purpose of the builder is to wrap a user method.
By default, the builder wraps the user method named `render`.
The user method is responsible to generate a `Template` which is responsible to patch the tree of a DOM node.
The wrapping is responsible to execute the `Template` on the Custom Element DOM.

The easiest way to get a `Template` instance is to use a string literal with the tag `html`.

The builder handles both light and shadow DOM, by default the builder selects the light DOM.

```typescript
import {ElementBuilder, TemplateBuilder, html, Template} from "ceb"
class HelloWorld extends HTMLElement {
  name = "World"
  // When render() is called, the template is returned but,
  // the element is patched too!
  render(): Template {
    // The method creates a Template using the literal `html`
    return html`<p>Hello, ${this.name}!</p>`
  }
}

ElementBuilder.get()
  // apply the "template" builder
  .builder(TemplateBuilder.get())
  // register the Custom Element `hello-word`
  .register()
```

## The Light, Grey and Shadow DOMs

When a Custom Element is responsible for a part of its child nodes, the usage of [Shadow DOM] is welcoming.
Shadow DOM handles the [HTMLSlotElement] elements which can be used as placeholders.
However, Shadow DOM brings a level of isolation which is not always welcome.
It is the case for the _shadowified_ markup which relies on common stylesheets.

The template engine provides a solution: the Grey DOM.
The purpose is to keep the concept of placeholder but in the Light DOM.
Therefore, the DOM tree between the Custom Element node, and the placeholder node becomes a Grey DOM.

Basically, a Grey DOM can only be mutated from its Custom Element and, the Custom Element can only mutate its Grey DOM.
Moreover, like for the Shadow DOM, the Grey DOM handles `<ceb-slot>` elements to manage the placeholders.
However, the Grey DOM is not isolated from the Light DOM context (javascript, styles ...).
For senior JS developers :), it is similar to the [transclude] concept implemented in [AngularJS].

[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[HTMLSlotElement]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot
[AngularJS]: https://angularjs.org
[transclude]: https://code.angularjs.org/1.8.2/docs/guide/directive#creating-a-directive-that-wraps-other-elements

The Grey DOM feature is not activated by default.
To activate it, the option `greyDom`.

## Template with string literal

### Text

Write the content `Hello, World!` in the `<p>` element:

```typescript
import {html, Template} from '@tmorin/ceb'
const name = "World"
const template: Template = html`<p>Hello, ${name}!</p>`
```

### Attribute

Set the value `foo` to the attribute `bar`:

```typescript
import {html, Template} from '@tmorin/ceb'
const value = "foo"
const template: Template = html`<input bar="${value}">`
```

Set boolean values, the `checked` attribute won't be rendered because its value is `false`:

```typescript
import {html, Template} from '@tmorin/ceb'
const checked = false
const template: Template = html`<input required disabled="" checked="${checked}">`
```

### Property

Set the value `foo` to the property `bar`:

```typescript
import {html, Template} from '@tmorin/ceb'
const value = "Foo"
const template: Template = html`<input p:bar="${value}">`
```

### Prevent extra processing

The special attribute `o:skip`, notify the template engine that the children of the element should not be processed.

```typescript
import {html, Template} from '@tmorin/ceb'
const template: Template = html`<div><ul o:skip></ul></div>`
```

When rendering within a Shadow DOM, the usage of the element `<slot>` have the same effect: the children of the `slot` element won't be processed.

## The Grey DOM feature

The special element `<ceb-sot></ceb-slot>` is the marker of the placeholder.

Given the following Custom Element with template expressed using the literal approach:
```typescript
import {ElementBuilder, TemplateBuilder, html, Template} from "ceb"
class HelloWorld extends HTMLElement {
  render(): Template {
    return html`<p>Hello, <ceb-slot></ceb-slot>!</p>`
  }
}

ElementBuilder.get().builder(TemplateBuilder.get().options({
  greyDom: true // activate the Grey DOM feature
})).register()
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

## The decorator

Templates can also be defined using decorators.

```typescript
import {ElementBuilder, TemplateBuilder} from '@tmorin/ceb'
// register the custom element
@ElementBuilder.element<MyCustomElement>()
// defines the custom element class
class MyCustomElement extends HTMLElement {
  name = "World"
  // When render() is called, the template is returned but,
  // the element is patched too!
  @TemplateBuilder.template()
  render(): Template {
    // The method create a Template using the literal `html`
    return html`<p>Hello, ${this.name}!</p>`
  }
}
```

## Example

The registered custom element is initialized with a Grey DOM.

<p class="codepen" data-height="400" data-theme-id="light" data-default-tab="js,result" data-slug-hash="MWYjxPQ" data-editable="true" data-user="tmorin" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tmorin/pen/MWYjxPQ">
  &lt;/ceb&gt; ~ TemplateBuilder</a> by Thibault Morin (<a href="https://codepen.io/tmorin">@tmorin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
