# `<ceb/>` ~ custom-element-builder

[![npm version](https://badge.fury.io/js/%40tmorin%2Fceb.svg)](https://badge.fury.io/js/%40tmorin%2Fceb)
[![Continous Integration - Build](https://github.com/tmorin/ceb/actions/workflows/ci-build.yaml/badge.svg)](https://github.com/tmorin/ceb/actions/workflows/ci-build.yaml)
[![manual](https://img.shields.io/badge/-manual-informational.svg)](https://tmorin.github.io/ceb/)
[![api](https://img.shields.io/badge/-api-informational.svg)](https://tmorin.github.io/ceb/api)

> `<ceb/>` is a library helping to develop [Custom Elements (v1)].
Its core is a builder which executes others builders.
By this way, `<ceb/>` is natively opened to extensions and builders easily sharable.

## Quickly

```typescript
import {ElementBuilder, FieldBuilder, TemplateBuilder} from "ceb"

// Define the Custom Element
@ElementBuilder.get<ExGreeting>().element()
export class ExGreeting extends HTMLElement {
  // Bind the property `name` to the attribute `name`
  @FieldBuilder.field()
  name = "World"

  // Define the template of the custom element
  @TemplateBuilder.template()
  private render() {
    return html`<p>Hello, ${this.name}!</p>`
  }
  
  // Render the template when the name change
  @FieldBuilder.listen()
  private onName() {
    this.render()
  }
}
```

```html
<ex-greeting name="John Doe" />
```

## Install

From npm or yarn or ... from npm what?

```bash
npm install @tmorin/ceb
```

Directly in the browser

```html
<script src="https://unpkg.com/@tmorin/ceb/dist/ceb.min.js"></script>
```

## License

Released under the [MIT license].

[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
