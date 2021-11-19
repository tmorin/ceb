# `<ceb/>` ~ custom-element-builder

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
} from "@tmorin/ceb-bundle-web";

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

<simple-greeting name="John Doe"/>
```

## Packages

The library is composed of many packages.

The packages related to the definition of [Custom Elements (v1)]:

- [ceb-elements-core](./packages/ceb-elements-core)
- [ceb-elements-builders](./packages/ceb-elements-builders)
- [ceb-elements-testing](./packages/ceb-elements-testing)

A built-in implementation of a templating system:

- [ceb-templating-builder](./packages/ceb-templating-builder)
- [ceb-templating-engine](./packages/ceb-templating-engine)
- [ceb-templating-literal](./packages/ceb-templating-literal)
- [ceb-templating-parser](./packages/ceb-templating-parser)

A built-in implementation of the Inversion of Control principle:

- [ceb-inversion-core](./packages/ceb-inversion-core)
- [ceb-inversion-builder](./packages/ceb-inversion-builder)
- [ceb-inversion-testing-core](./packages/ceb-inversion-testing-core)
- [ceb-inversion-testing-mocha](./packages/ceb-inversion-testing-mocha)

A built-in implementation of the Event/Message architecture:

- [ceb-messaging-core](./packages/ceb-messaging-core)
- [ceb-messaging-simple](./packages/ceb-messaging-simple)
- [ceb-messaging-simple-builder](./packages/ceb-messaging-simple-builder)
- [ceb-messaging-dom](./packages/ceb-messaging-dom)
- [ceb-messaging-builder-core](./packages/ceb-messaging-builder-core)
- [ceb-messaging-builder-inversion](./packages/ceb-messaging-builder-inversion)
- [ceb-messaging-adapter-electron](./packages/ceb-messaging-adapter-electron)
- [ceb-messaging-testing](./packages/ceb-messaging-testing)

Bundles:

- [ceb-bundle-web](./packages/ceb-bundle-web) : a bundle of `ceb-elements-core`, `ceb-elements-builders`, `ceb-templating-builder` and `ceb-templating-literal`

The helper packages:

- [ceb-utilities](./packages/ceb-elements-testing)

The examples:

- [ceb-example-greeting](./packages/ceb-example-greeting)

## License

Released under the [MIT license].

[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html

[MIT license]: http://opensource.org/licenses/MIT
