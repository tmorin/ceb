# `<ceb/>` ~ custom-element-builder

[![npm version](https://badge.fury.io/js/%40tmorin%2Fceb.svg)](https://badge.fury.io/js/%40tmorin%2Fceb)
[![Continous Integration - Build](https://github.com/tmorin/ceb/actions/workflows/ci-build.yaml/badge.svg)](https://github.com/tmorin/ceb/actions/workflows/ci-build.yaml)
[![manual](https://img.shields.io/badge/-manual-informational.svg)](https://tmorin.github.io/ceb/)
[![api](https://img.shields.io/badge/-api-informational.svg)](https://tmorin.github.io/ceb/api)

> `<ceb/>` is a library providing building blocks to develop [Custom Elements (v1)]. Additionally, other building blocks are also provided to cover the implementation of web applications based on the Event/Message Architecture.

## Quickly

[![Edit <ceb/> ~ SimpleGreeting](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/ceb-simplegreeting-unj2w?fontsize=14&hidenavigation=1&theme=dark)

```typescript
import {
  ElementBuilder,
  FieldBuilder,
  html,
  TemplateBuilder
} from "@tmorin/ceb";

// register the custom element
@(ElementBuilder.get().decorate())
export class SimpleGreeting extends HTMLElement {
  // defines a field `name`
  // which is available as an attribute or a property
  @(FieldBuilder.get().decorate())
  name: string = "World";

  // reacts on the mutations of the field `name`
  // so that new name will be rendered
  @(FieldBuilder.get().decorate())
  private onName() {
    this.render();
  }

  // defines the content of the custom element
  // each time the method is inovked, the template is rendered
  @(TemplateBuilder.get().preserveContent().decorate())
  private render() {
    return html`<h1>Hello, ${this.name}!</h1>`;
  }
}
```

```html
<simple-greeting name="John Doe" />
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
