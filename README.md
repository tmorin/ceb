# `<ceb/>` ~ custom-element-builder

[![Continous Integration - Build](https://github.com/tmorin/ceb/actions/workflows/ci-build.yaml/badge.svg)](https://github.com/tmorin/ceb/actions/workflows/ci-build.yaml)
[![manual](https://img.shields.io/badge/-manual-informational.svg)](https://tmorin.github.io/ceb/)
[![api](https://img.shields.io/badge/-api-informational.svg)](https://tmorin.github.io/ceb/api)

> `<ceb/>` was initially a library dedicated for the authoring of [Custom Elements (v0)] then [Custom Elements (v1)].
> However, the library is now providing building blocks going beyond the topic of composable UI elements.
> It's about fundamental design principles, messaging, functional rendering and obviously composition of UI elements ;).

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
- [ceb-messaging-inversion](./packages/ceb-messaging-inversion)
- [ceb-messaging-simple](./packages/ceb-messaging-simple)
- [ceb-messaging-simple-builder](./packages/ceb-messaging-simple-builder)
- [ceb-messaging-builder-core](./packages/ceb-messaging-builder-core)
- [ceb-messaging-builder-inversion](./packages/ceb-messaging-builder-inversion)
- [ceb-messaging-adapter-dom](./packages/ceb-messaging-adapter-dom)
- [ceb-messaging-adapter-electron](./packages/ceb-messaging-adapter-electron)
- [ceb-messaging-adapter-purify](./packages/ceb-messaging-adapter-purify)
- [ceb-messaging-testing](./packages/ceb-messaging-testing)

Bundles:

- [ceb-bundle-web](./packages/ceb-bundle-web) : a bundle of `ceb-elements-core`, `ceb-elements-builders`, `ceb-templating-builder` and `ceb-templating-literal`

The helper packages:

- [ceb-utilities](./packages/ceb-elements-testing)

The examples:

- [ceb-example-greeting](./packages/ceb-example-greeting)

## License

Released under the [MIT license].

[Custom Elements (v0)]: https://www.w3.org/TR/2018/WD-custom-elements-20180216/
[Custom Elements (v1)]: https://html.spec.whatwg.org/multipage/custom-elements.html
[MIT license]: http://opensource.org/licenses/MIT
